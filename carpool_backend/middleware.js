require("dotenv").config();
const asyncHandler = require("express-async-handler");

const { FIREBASE_ADMIN } = require("./firebase");

const authenticate = (req, res, next) => {
  console.log("INSIDE AUTHENTICATE");
  const token = req.headers.authorization;
  const userId = req.headers.userid;
  console.log(userId);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  FIREBASE_ADMIN.verifyIdToken(token)
    .then((decodedToken) => {
      req.user = decodedToken;
      const tokenUserId = decodedToken.uid;
      // Verify token belongs to user
      if (userId !== tokenUserId) {
        return res
          .status(403)
          .json({
            error: "Forbidden - User does not have access to this data",
          });
      }
      console.log("User token verified!");
      next();
    })
    .catch((error) => {
      console.error(`Error verifying token: ${error}`);
      res.status(401).json({ error: "Unauthorized" });
    });
};

module.exports = { authenticate };
