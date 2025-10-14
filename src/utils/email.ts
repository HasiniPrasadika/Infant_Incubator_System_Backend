// // sendRegistrationEmail function using Nodemailer
// import nodemailer from 'nodemailer';

// export const sendRegistrationEmail = (parentUsername: string, link: string) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail', // Choose your email provider
//     auth: {
//       user: process.env.EMAIL_USER, // Your email user
//       pass: process.env.EMAIL_PASSWORD, // Your email password
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: parentUsername,
//     subject: 'Registration Link for Your Account',
//     text: `Click the following link to register: ${link}`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error sending email:', error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// };
