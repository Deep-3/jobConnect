const express=require('express');
const router=express.Router();
const {capturePayment,verifySignature}=require("../controllers/paymentcontroller");

router.get("/",capturePayment);
router.post("/verifySignature",verifySignature);
module.exports=router;


