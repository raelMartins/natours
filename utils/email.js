const nodemailer = require('nodemailer');

module.exports = async options => {
  //create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  //define email options
  const mailOptions = {
    from: 'Martins Akeredolu <me@reality.dev>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };
  //send email with nodemailer
  await transporter.sendMail(mailOptions);
};
