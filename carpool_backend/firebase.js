const admin = require("firebase-admin");

const serviceAccount = require("./ridealong-413818-firebase-adminsdk-vkgej-36453ffc1a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports.FIREBASE_ADMIN = admin.auth();
