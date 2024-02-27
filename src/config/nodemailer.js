
// import nodemailer
import nodemailer from 'nodemailer';

// Configure email and send it.
export async function sendMail(toEmail) {
    // Create an email transporter.
    // SMTP (Simple Mail Transfer Protocol)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:'pratikmore408@gmail.com',
            pass:'tjtvjpcacpmusvvf'
        }
    });

    // Configure email content
    const mailOptions = {
        from: 'pratikmore408@gmail.com',
        to: toEmail,
        subject: 'Welcome to Authentication App',
        text: 'Sign In is Detected in Your Account',
    };

    // Send the email
    try {
        const result = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (err) {
        console.log(`Email send failure with error: ${err}`);
    }
};







