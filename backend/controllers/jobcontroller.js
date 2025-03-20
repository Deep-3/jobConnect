const db=require('../models')
exports.getAllJob=async(req,res)=>{

    const { page = 1}=req.params;
    let limit=3;
    let job;
    const offset = (page - 1) * limit;
    try{
        if(page!=='0')
        {
    
            job=await db.Job.findAndCountAll({
                include:{
                    model:db.Company,
                    as:'company',
                    attributes:['companyName','companyLogo','companyWebsite'],
                },
                limit: parseInt(limit),
                offset: parseInt(offset)
             })

             console.log(job)
         let totalpage;
         if(limit<job.count)
         {
         totalpage=parseInt(job.count/limit);
         if(parseInt(job.count%limit)!=0)
         {
           totalpage+=1;
         }

         }
         else
         totalpage=1;
         return res.status(200).json({
            success:true,
            data:job,
            totalpage
         })
        }
        else
        {
            job=await db.Job.findAll({
                include:{
                    model:db.Company,
                    as:'company',
                    attributes:['companyName','companyLogo','companyWebsite'],
                },
             })
        }
        
         return res.status(200).json({
            success:true,
            data:job,
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
