const nodemailer = require('nodemailer');

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

const sendOtp = (email, otp) => {
  const mailOptions = {
    from:process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Account Verification',
    text: `Your OTP is: ${otp}`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendOtp };
