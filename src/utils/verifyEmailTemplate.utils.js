const verifyEmailTemplate = ({ name, url }) => {
  return `
    <p> Dear ${name}, Welcome To Order App </p>
    <a href=${url} style="color:white;background : blue;margin-top : 10px,padding:20px,display:block">
        Verify Email
    <a>`;
};

export { verifyEmailTemplate };
