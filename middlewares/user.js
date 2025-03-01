const jwt = require('jsonwebtoken');
const { JWT_SECRET_USER } = require('../config');

function userMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if(!token) {
    return res.status(403).json({
      message: 'Forbidden',
    });
  }

  try {
    const verify = jwt.verify(token, JWT_SECRET_USER);
    req.userId = verify.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
}

module.exports = {
    userMiddleware,
}