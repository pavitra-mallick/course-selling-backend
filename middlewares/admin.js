const jwt = require("jsonwebtoken");
const { JWT_SECRET_ADMIN } = require("../config");

function adminMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  try {
    const verify = jwt.verify(token, JWT_SECRET_ADMIN);
    req.adminId = verify.adminId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

module.exports = {
  adminMiddleware,
};
