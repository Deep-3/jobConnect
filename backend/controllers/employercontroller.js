const employerService = require('../services/employerService');
const db=require('../models');
const {ReportCSV}=require('../utils/reportgenerate')

// Company Management
exports.createCompanyProfile = async (req, res) => {
    try {
        console.log("logo",req.body)
        const result = await employerService.createCompanyProfile(req.body, req.user.id,req.files);
        console.log("...",result)
        if (result.error) {
            return res.status(400).json({ success:false,message: result.error });
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ success:false,message: error.message });
    }
};

exports.checkCompanyExists = async (req, res) => {
    try {
  
        const existingEmployeeCompany = await db.Company.findOne({
            where: { employeeId: req.user.id }
        });
  
        if (existingEmployeeCompany) {
            return res.status(400).json({ 
                success:true,
                company:existingEmployeeCompany,
                message: 'You have already created a company.'
            });
        }
        else
        {
          return res.status(400).json({ 
            success:false,
            message: 'You have add the company'
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  };

exports.getCompanyProfile = async (req, res) => {
    try {
        const result = await employerService.getCompanyProfile(req.user.id);
        if (result.error) {
            return res.status(404).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCompanyProfile = async (req, res) => {
    try {
        const result = await employerService.updateCompanyProfile(req.user.id, req.body,req.files);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Job Management
exports.createJob = async (req, res) => {
    try {
        const result = await employerService.createJob(req.user.id, req.body);
        if (result.error) {
            return res.status(400).json({ success:false,message: result.error });
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCompanyJobs = async (req, res) => {
    try {
        const result = await employerService.getCompanyJobs(req.user.id);
        if (result.error) {
            return res.status(404).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin Verification
exports.verifyCompany = async (req, res) => {
    try {
        const result = await employerService.verifyCompany(req.user.id, req.params.companyId);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPendingCompanies = async (req, res) => {
    try {
        const result = await employerService.getPendingCompanies(req.user.id);
        if (result.error) {
            return res.status(404).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getApplication=async(req,res)=>{
    try {
        const result = await employerService.getApplication(req.user.id);
        if (result.error) {
            return res.status(404).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.updateApplication  = async (req, res) => {
    try {
        const result = await employerService.updateApplication(req);
        if (result.error) {
            return res.status(404).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.particularJobApplication=async(req,res)=>{
    const {id}=req.params;
    try {
        const data=await db.JobApplication.findAll({
            where:{
                jobId:id
            },
            include:[{
                model:db.User,
                as:'user',
                attributes:['name','email']
            }]
        })
        
        return res.status(200).json({
            success:true,
            data
        })

    }
    catch (error) {
    }

}

exports.applicationDataCsv=async(req,res)=>{

    const {id}=req.params;
    
    try{
    
            const data=await db.JobApplication.findAll({
                where:{
                    jobId:id
                },
                include:[{
                    model:db.User,
                    as:'user',
                    attributes:['name','email']
                },{
                    model:db.Job,
                    as:'job',
                    attributes:['title']
                }]
            });
            const csvData = data.map((item) => {
     
                return {
                     "Name":item.user.name,
                     "Email":item.user.email,
                     "Skill":item.skills,
                     "Experience":item.experience,
                     "Applied Date":new Date(item.appliedAt).toLocaleDateString('en-Us',{
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                     }),
                      "resumeUrl":item.resumeUrl,
                     "Status":item.status
                }
            })
            console.log(csvData)
          const csv=  ReportCSV(csvData);
        console.log(csv)
          if(csv)
          {
            const filename = `${data[0].job.title}.csv`;
        
            // Add these headers
            res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.status(200).send(csv);
          }
          else
          {
            res.status(404).send("No data found");
          }
    }
    catch(error)
    {
        console.log(error)
    }
  }


  exports.getDashboard=async(req,res)=>{
    try{
        const company = await db.Company.findOne({
            where: { employeeId: req.user.id }
          });
         
          if (!company) {
            return res.json({success:false,message:"company profile not found"});
          }
      
          const jobs = await db.Job.findAndCountAll({
            where: { companyId: company.id,
            },
            order: [['createdAt', 'DESC']],
            include:{
                model:db.JobApplication,
                as:'applications',
                include:{
                    model:db.User,
                    as:'user',
                    attributes:['name']
                }
            }
          });
      
       
      return res.status(200).json(
      
        {success:true,jobs}
      )
      
  }
  catch(error)
  {
      return res.json({
        success:false,
        error:error.message
      })
  }
  }