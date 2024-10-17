
import nodemailer from 'nodemailer';


const mailNodemailer={
    _sendOtpToMail: async (otp,email) => {
        const mailTransporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_EMAIL_API_KEY,
          },
        });
    
        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: email,
          subject: "Email Verification",
          text: `Your Email Verification Otp is ${otp}`
        }    
        // Send email with OTP
        const emailResult = await mailTransporter.sendMail(mailOptions);
        console.log('Email sent successfully:', emailResult);
        return emailResult;
    }
}


export default mailNodemailer;