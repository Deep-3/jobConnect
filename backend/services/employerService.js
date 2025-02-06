const db = require('../models');
const { User, EmployerProfile, Company, Job } = db;
const {s3,PutObjectCommand,getSignedUrl,GetObjectCommand,DeleteObjectCommand}=require('../utils/presign')

// Company Management
exports.createCompanyProfile = async (profileData, userId, companyLogo) => {
  try {
    // Basic validation
    if (!profileData.companyName) {
      return { error: 'Company name is required' };
    }

    // Check if employee already has a company
    const existingEmployeeCompany = await Company.findOne({
      where: { employeeId: userId }
    });

    if (existingEmployeeCompany) {
      return { error: 'You have already created a company.' };
    }

    // Check if company name exists
    const existingCompany = await Company.findOne({
      where: { companyName: profileData.companyName }
    });

    if (existingCompany) {
      return { error: 'This company name is already taken. Please choose a different name.' };
    }

    if (companyLogo) {
      // Delete previous logo if exists
      if (existingCompany && existingCompany.companyLogo) {
        try {
          await s3.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: existingCompany.companyLogo
          }));
          console.log('Previous logo deleted successfully');
        } catch (deleteError) {
          console.error('Error deleting previous logo:', deleteError);
          // Continue with upload even if delete fails
        }
      }

      // Upload new logo
      const companyLogoKey = `company-logos/${userId}-${Date.now()}-${companyLogo.logo.name}`;
    
      try {
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: companyLogoKey,
          Body: companyLogo.logo.data,
          ContentType: companyLogo.logo.mimetype
        };

        await s3.send(new PutObjectCommand(uploadParams));
        profileData.companyLogo = `https://${process.env.AWS_S3_BUCKET}.s3.ap-south-1.amazonaws.com/${companyLogoKey}`;
      } catch (uploadError) {
        console.error('Error uploading to S3:', uploadError);
        return { error: 'Failed to upload company logo' };
      }
    }

    // Create company profile
    const company = await Company.create({
      employeeId: userId,
      ...profileData,
      companyCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      subscriptionPlan: 'free',
      subscriptionStatus: 'active',
      status: 'pending',
      isVerified: false,
      socialLinks: {}
    });

    // Update employer profile
    await EmployerProfile.update(
      { 
        companyId: company.id
      },
      { where: { userId } }
    );

    return {
      success: true,
      message: 'Company profile created and pending verification',
      data: { 
        company,
        companyCode: company.companyCode
      }
    };
  } catch (error) {
    return { error: error.message };
  }
};

exports.getCompanyProfile = async (userId) => {
  try {
    const company = await Company.findOne({
      where: { employeeId: userId },
       include:{
        model:EmployerProfile,
        as:'employee',
       }
    });

    if (!company) {
      return { error: 'Company profile not found' };
    }

    return {
      success: true,
      data: company
    };
  } catch (error) {
    return { error: error.message };
  }
};

exports.updateCompanyProfile = async (userId, updateData) => {
  try {
    const company = await Company.findOne({
      where: { employeeId: userId }
    });

    if (!company) {
      return { error: 'Company profile not found' };
    }

    const updatedCompany = await company.update(updateData);

    return {
      success: true,
      message: 'Company profile updated successfully',
      data: updatedCompany
    };
  } catch (error) {
    return { error: error.message };
  }
};

// Job Management
exports.createJob = async (userId, jobData) => {
  try {

    const company = await Company.findOne({
      where: { employeeId: userId}
    });

    if (!company) {
      return { error: 'Not add any company.first add your comapny' };
    }
    if (!company.isVerified) {
      return { error: 'Verified company profile required to post jobs' };
    }

   
    const job = await Job.create({
      ...jobData,
      companyId: company.id,
      status: 'active'
    });

    return {
      success: true,
      data: job
    };
  } catch (error) {
    return { error: error.message };
  }
};

exports.getCompanyJobs = async (userId) => {
  try {
    const company = await Company.findOne({
      where: { employeeId: userId }
    });
   
    if (!company) {
      return { error: 'Company profile not found' };
    }

    const jobs = await Job.findAll({
      where: { companyId: company.id },
      order: [['createdAt', 'DESC']]
    });

    return {
      success: true,
      data: jobs
    };
  } catch (error) {
    return { error: error.message };
  }
};

// Admin Verification
exports.verifyCompany = async (adminId, companyId) => {
  try {
    const admin = await User.findOne({
      where: { id: adminId, role: 'admin' }
    });

    if (!admin) {
      return { error: 'Only admin can verify companies' };
    }

    const company = await Company.findByPk(companyId);
    if (!company) {
      return { error: 'Company not found' };
    }

    await company.update({
      isVerified: true,
      verifiedBy: adminId,
      verifiedAt: new Date(),
      status: 'active'
    });

    // Update user role to admin after verification
    await User.update(
      { role: 'admin' },
      { where: { id: company.employeeId } }
    );

    return {
      success: true,
      message: 'Company verified successfully',
      data: company
    };
  } catch (error) {
    return { error: error.message };
  }
};

exports.getPendingCompanies = async (adminId) => {
  try {
   

    const company = await Company.findAll({
      where: { 
        isVerified: false
      },
      include: [{
        model: EmployerProfile,  // Use the actual model, not a string
        as: 'employee'
      }]
    });

    return {
      success: true,
      data: company
    };
  } catch (error) {
    return { error: error.message };
  }
};