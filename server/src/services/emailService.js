const transporter = require("../config/email");

// async function sendVerificationEmail(email, name, otp) {
//     const mailOptions = {
//         from: `"Solar Inverter System" <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: "Verify your email address",
//         html: `
//             <div style="font-family: Arial, sans-serif;">
//                 <h2>Email Verification</h2>

//                 <p>Hello ${name},</p>

//                 <p>
//                     Thank you for registering.
//                     Your email verification code is:
//                 </p>

//                 <h1 style="letter-spacing: 5px;">
//                     ${otp}
//                 </h1>

//                 <p>
//                     This code will expire in 10 minutes.
//                 </p>

//                 <p>
//                     If you did not create this account,
//                     you can ignore this email.
//                 </p>
//             </div>
//         `
//     };

//     await transporter.sendMail(mailOptions);
// }


async function sendVerificationEmail(email, name, otp) {
  const mailOptions = {
    from: `"Solar Inverter System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Email Verification</h2>

        <p>Hello ${name},</p>

        <p>
          Thank you for registering.
          Your email verification code is:
        </p>

        <h1 style="letter-spacing: 5px;">
          ${otp}
        </h1>

        <p>This code will expire in 10 minutes.</p>

        <p>
          If you did not create this account,
          you can ignore this email.
        </p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("📧 Verification email sent:");
  console.log("Message ID:", info.messageId);
  console.log("Response:", info.response);
  console.log("Accepted:", info.accepted);
  console.log("Rejected:", info.rejected);

  return info;
}

// async function sendPasswordResetEmail(email, name, otp) {
//     const mailOptions = {
//         from: `"Solar Inverter System" <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: "Password Reset OTP",
//         html: `
//             <div style="font-family: Arial, sans-serif;">
//                 <h2>Password Reset</h2>

//                 <p>Hello ${name},</p>

//                 <p>
//                     Your password reset code is:
//                 </p>

//                 <h1 style="letter-spacing: 5px;">
//                     ${otp}
//                 </h1>

//                 <p>
//                     This code will expire in 10 minutes.
//                 </p>

//                 <p>
//                     If you did not request a password reset,
//                     please ignore this email.
//                 </p>
//             </div>
//         `
//     };

//     await transporter.sendMail(mailOptions);
// }



async function sendPasswordResetEmail(email, name, otp) {
  const mailOptions = {
    from: `"Solar Inverter System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset</h2>

        <p>Hello ${name},</p>

        <p>Your password reset code is:</p>

        <h1 style="letter-spacing: 5px;">
          ${otp}
        </h1>

        <p>This code will expire in 10 minutes.</p>

        <p>
          If you did not request a password reset,
          please ignore this email.
        </p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("📧 Password reset email sent:");
  console.log("Message ID:", info.messageId);
  console.log("Response:", info.response);
  console.log("Accepted:", info.accepted);
  console.log("Rejected:", info.rejected);

  return info;
}
module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
};