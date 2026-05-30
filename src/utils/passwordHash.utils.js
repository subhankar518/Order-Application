import bcryptjs from "bcryptjs";

const passwordHash = async (password) => {
  try {
    console.log(password);

    const salt = await bcryptjs.genSalt(10);
    const modifiedPassword = await bcryptjs.hash(password, salt);

    return modifiedPassword;
  } catch (error) {
    console.error(error);
  }
};

export { passwordHash };
