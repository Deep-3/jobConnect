const {instance}=require("../config/razorpay");
const db=require("../models");
const { sendMail }=require('../utils/sendmail')
const {subscriptionMail}=require('../utils/pdfgenerate')
const crypto=require("crypto");

 

exports.capturePayment=async(req,res)=>{

    try
    { 
       const jobseeker=await db.JobSeekerProfile.findOne({where:{
        userId:req.user.id
       }})

       if(["premium","basic"].includes(jobseeker.subscriptionPlan))
       {
           return res.status(500).json({
            success:false,
            message:'Your Subscription Plan Alredy Exits'
           })
       }
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Internal Server Error'
            })
    }

    const amount=300;
    const currency="INR";

    const options={
        "amount":amount*100,
        "currency":currency,
        "receipt":Math.random(Date.now()).toString(),
        "notes":{
            userId:req.user.id
        }
    }
    try{
      const paymentResponse=await instance.orders.create(options);
      console.log(paymentResponse);

      return res.status(200).json({
        success:true,
        order:paymentResponse,
        key:process.env.RAZORPAY_KEY
        
      })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
            });
    }
}


exports.verifySignature=async(req,res)=>{

    //  const webhookSecret="12345678";
  console.log("...",req.body);
    //  const signature=req.headers["x-razorpay-signature"];
    // console.log("razorpay",signature);
    const body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
     const shasum=crypto.createHmac("sha256",process.env.RAZORPAY_SECRET);
     shasum.update(body.toString());
     const digest=shasum.digest("hex");
    
     console.log(digest)
     if(digest ===req.body.razorpay_signature)
        {
            // const {userId}=req.body.payload.payment.entity.notes;
            try
            {
                const profile=await db.JobSeekerProfile.findOne({where:{
                    userId:req.user.id
                },include:{
                    model:db.User,
                    as:'user',       
                    attributes:['name','email'],
                }});
                profile.subscriptionPlan="premium";
                profile.subscriptionStatus="active";
               await  profile.save();
            
                const data={
                    userName:profile.user.name,
                    userEmail: profile.user.email,
                    subscriptionPlan: profile.subscriptionPlan,
                    subscriptionStatus: profile.subscriptionStatus
                }
                const html = await subscriptionMail(data, 'subscription.hbs');
                     const emailResult=await sendMail(profile.user.email,"Subscription Plan",html);
                    //  return res.redirect(`${process.env.FRONTEND_URL}/paymentsuccess`);
                return res.status(200).json({
                    success:true,
                    message:"Payment sucessfully",
                    subscription:[profile.subscriptionPlan,profile.subscriptionStatus]
                    });
            }
            catch(error)
            {
                console.log(error);
                return res.status(500).json({
                    success:false,
                    message:error.message
                    });
            }
           
         }
         else
         {
             return res.status(401).json({
                 success:false,
                 message:"Invalid request"
                 });
          }
                        




}