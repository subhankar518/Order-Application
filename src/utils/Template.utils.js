const verifyEmailTemplate = ({ name, url }) => {
    return `
    <p> Dear ${name}, Welcome To Order App </p>
    <a href=${url} style="color:white;background : blue;margin-top : 10px,padding:20px,display:block">
        Verify Email
    <a>`;
};

const forgotPasswordTemplate = ({ name, otp }) => {
    return `
  <div>
    <p> Dear, ${name}</p>
    <p> You're requested for reset password. Please use following OTP code to reset your password.</p>
    <div style = "background:yellow;font-size:20px;padding:20px;text-align:center;font-weight:800">
      ${otp}
    </div>
    <p>This OTP is valid for 1 hour.</p>
    <p>Thanks,</p>
    <p>Order Application</p>
  </div>
  `;
};

export { verifyEmailTemplate, forgotPasswordTemplate };
