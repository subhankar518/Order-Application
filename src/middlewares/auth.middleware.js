import jwt from "jsonwebtoken";

const authHandler = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req?.header?.authorization?.split(" ")[1] ||
      req?.header("Authorization")?.replace("Bearer ", "");

    // console.log("----", token);

    if (!token) {
      return res.status(400).json({
        message: `Token not found`,
        error: true,
        success: false,
      });
    }

    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    );

    if (!decodedToken) {
      return res.status(401).json({
        message: "Unauthorized Access" || error,
        error: true,
        success: false,
      });
    }

    req.userId = decodedToken?.id;
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export { authHandler };
