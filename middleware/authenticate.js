const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  // The client sends: Authorization: Bearer <token>
  const authorization = req.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "A bearer token is required",
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new Error("JWT_SECRET is not configured"));
  }

  try {
    const payload = jwt.verify(token, secret);
    if (typeof payload !== "object" || typeof payload.userId !== "string") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    // Store the verified user ID on the request so the route can load the user.
    req.authUserId = payload.userId;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
      });
    }
    return next(error);
  }
}

module.exports = authenticate;
