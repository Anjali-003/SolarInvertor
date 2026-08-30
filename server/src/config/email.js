// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });

// module.exports = transporter;


// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,

//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },

//   tls: {
//     minVersion: "TLSv1.2",
//   },
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ EMAIL CONNECTION ERROR:");
//     console.error(error);
//   } else {
//     console.log("✅ Gmail SMTP connection ready");
//   }
// });

// module.exports = transporter;










const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },

  tls: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ EMAIL CONNECTION ERROR:");
    console.error(error);
  } else {
    console.log("✅ Gmail SMTP connection ready");
  }
});

module.exports = transporter;