const db=require('../models')
exports.getAllJob=async(req,res)=>{

    try{
         const job=await db.Job.findAll({
            include:{
                model:db.Company,
                as:'company',
                attributes:['companyName','companyLogo','companyWebsite']
            }
         })
         console.log(job)
         return res.status(200).json({
            success:true,
            data:job
         })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error Occured"
        })
    }

}