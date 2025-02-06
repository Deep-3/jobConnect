const db = require('../models');
const { User, JobSeekerProfile, Job, JobApplication,Company } = db;
const {s3,PutObjectCommand,getSignedUrl,GetObjectCommand,DeleteObjectCommand}=require('../utils/presign')
const { sendMail }=require('../utils/sendmail')
const {jobAplicationMail}=require('../utils/pdfgenerate')
exports.applyForJob = async (userId, jobId) => {
  try {
      // Get JobSeekerProfile data
      const jobSeekerProfile = await JobSeekerProfile.findOne({
          where: { userId },
          include:{
            model:User,
            as:'user',
            attributes:['email']
          }

      });

      if (!jobSeekerProfile) {
          return {
              success: false,
              error: 'Job seeker profile not found'
          };
      }

      // Check for missing profile fields
      const missingFields = {
          skills: !jobSeekerProfile.skills,
          education: !jobSeekerProfile.education,
          experience: !jobSeekerProfile.experience,
          resumeUrl: !jobSeekerProfile.resumeUrl
      };

      if (Object.values(missingFields).some(field => field)) {
          return {
              success: false,
              error: 'Please complete your profile before applying',
              requiresProfileCompletion: true,
              missingFields
          };
      }

      // Check job status
      const job = await Job.findOne({
          where: { 
              id: jobId,
              status: 'active'
          }
      });

      if (!job) {
          return {
              success: false,
              error: 'Job not found or not accepting applications'
          };
      }

      // Check for duplicate application
      const existingApplication = await JobApplication.findOne({
          where: {
              jobId,
              jobSeekerId: jobSeekerProfile.id
          }
      });

      if (existingApplication) {
          return {
              success: false,
              error: 'You have already applied for this job'
          };
      }

      // Create application
      const application = await JobApplication.create({
          jobId,
          jobSeekerId: jobSeekerProfile.id,
          resumeUrl: jobSeekerProfile.resumeUrl,
          skills: jobSeekerProfile.skills,
          education: jobSeekerProfile.education,
          experience: jobSeekerProfile.experience,
      });

      // Get complete application with associations
      const applicationDetails = await JobApplication.findOne({
          where: { id: application.id },
          include: [{
              model: Job,
              as: 'job',
              include: [{
                  model: Company,
                  as: 'company',
                  attributes: ['id', 'companyName']
              }]
          }]
      });

      // Transform for template
      const completeApplication = {
          id: applicationDetails.id,
          status: applicationDetails.status,
          createdAt: new Date(applicationDetails.createdAt).toLocaleDateString(),
          updatedAt: new Date(applicationDetails.updatedAt).toLocaleDateString(),
          job: {
              id: applicationDetails.job.id,
              title: applicationDetails.job.title,
              description: applicationDetails.job.description,
              location: applicationDetails.job.location,
              salary:`₹${applicationDetails.job.salary.min.toLocaleString()} - ₹${applicationDetails.job.salary.max.toLocaleString()}`, // Format salary range,
              company: {
                  id: applicationDetails.job.company.id,
                  companyName: applicationDetails.job.company.companyName
              }
          }
      };

      // Send email notification
      const html = await jobAplicationMail(completeApplication, 'jobapplication.hbs');
      const emailResult=await sendMail(jobSeekerProfile.user.email,html)
      if (!emailResult.success) {
        console.error('Email sending failed:', emailResult.error);
    }

    return {
        success: true,
        message: emailResult.success 
            ? 'Application submitted and confirmation email sent'
            : 'Application submitted but email notification failed',
        data: completeApplication
    };


  } catch (error) {
      console.error('Job application error:', error);
      return {
          success: false,
          error: 'Failed to submit application. Please try again.'
      };
  }
};

exports.getJobSeekerProfile = async (userId) => {
  try {
    const profile = await JobSeekerProfile.findOne({
      where: { userId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email']
      }]
    });

    if (!profile) {
      return { error: 'Profile not found' };
    }

    return {
      success: true,
      data: profile
    };
  } catch (error) {
    return { error: error.message };
  }
};

exports.updateProfile = async (userId, profileData, resumeFile) => {
  try {
    const profile = await JobSeekerProfile.findOne({
      where: { userId }
    });
    console.log("resumefile", resumeFile);

    if (!profile) {
      return { error: 'Profile not found' };
    }

    let updateData = profileData ? {
      skills: profileData.skills,
      education: profileData.education,
      experience: profileData.experience,
      certifications: profileData.certifications
    } : {};

    // Handle resume upload if a new file is uploaded
    if (resumeFile) {
      // Delete previous resume if exists
      if (profile.resumeUrl) {
        try {
          await s3.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: profile.resumeUrl
          }));
          console.log('Previous resume deleted successfully');
        } catch (deleteError) {
          console.error('Error deleting previous resume:', deleteError);
          // Continue with upload even if delete fails
        }
      }

      // Upload new resume
      const resumeKey = `resumes/${userId}-${Date.now()}-${resumeFile.resume.name}`;
    
      try {
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: resumeKey,
          Body: resumeFile.resume.data,
          ContentType: resumeFile.resume.mimetype,
        };

        await s3.send(new PutObjectCommand(uploadParams));
        updateData.resumeUrl = resumeKey;
      } catch (uploadError) {
        console.error('Error uploading to S3:', uploadError);
        return { error: 'Failed to upload resume' };
      }
    }

    // Update profile with new data
    await profile.update(updateData);

    // Generate presigned URL if resume exists
    let presignedUrl = null;
    if (profile.resumeUrl) {
      presignedUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: profile.resumeUrl
        }),
        { expiresIn: 3600 }
      );
    }

    return {
      success: true,
      message: 'Profile updated successfully',
      data: {
        ...profile.toJSON(),
        resumeUrl: presignedUrl
      }
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { error: error.message };
  }
};

// Get all applications for a jobseeker
exports.getMyApplications = async (userId) => {
    try {
      // First get JobSeekerProfile id
      const jobSeekerProfile = await JobSeekerProfile.findOne({
        where: { userId }
      });
  
      if (!jobSeekerProfile) {
        return {
          success: false,
          error: 'JobSeeker profile not found'
        };
      }
  
      // Get all applications with job and company details
      const applications = await JobApplication.findAll({
        where: { 
          jobSeekerId: jobSeekerProfile.id 
        },
        attributes: ['id', 'status', 'createdAt'],
        include: [{
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'location', 'jobType', 'salary'],
          include: [{
            model: Company,
            as: 'company',
            attributes: ['id', 'companyName']
          }]
        }],
        order: [['createdAt', 'DESC']]
      });
  
      // Format the response data
      const formattedApplications = applications.map(app => ({
        id: app.id,
        status: app.status,
        appliedDate: app.createdAt,
        job: {
          id: app.job.id,
          title: app.job.title,
          location: app.job.location,
          type: app.job.jobType,
          salary: app.job.salary,
          company: {
            id: app.job.company.id,
            location: app.job.company.location
          }
        }
      }));
  
      return {
        success: true,
        count: applications.length,
        data: formattedApplications
      };
  
    } catch (error) {
      console.error('Error in getMyApplications:', error);
      return { 
        success: false,
        error: 'Failed to fetch applications' 
      };
    }
  };
  