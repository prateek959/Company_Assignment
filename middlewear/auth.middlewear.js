import jwt from "jsonwebtoken";

const extractToken = (authHeader) => {
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};

const checkToken = async (req, res, next) => {
  try {
    const AccessHeader = req.headers.accessToken;

    const accessToken = await extractToken(AccessHeader);

    if (accessToken) {
      const decode = jwt.decode(accessToken, process.env.JWT_ACCESS_KEY);
      req.user = decode;
      return next();
    }

    res.status(400).json({ msg: "Unauthorized access" });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};


export { checkToken };