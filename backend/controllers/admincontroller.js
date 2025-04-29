const db=require('../models');

exports.getdashboard=async(req,res)=>{

    try
    {
           const users=await db.User.findAndCountAll();
           const company=await db.Company.findAndCountAll();
           
           return res.json({
            success:true,
            data: { users, company }
           })
    }
    catch(error)
    {
         return res.json({
            success: false, message:error.message
         })
    }
}