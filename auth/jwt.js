const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
async function createToken(_id) {
  return await jwt.sign({ _id }, secret, { expiresIn: "2 days" });
}
function validateToken(token) {
  return jwt.verify(token, secret);
}
module.exports = { createToken, validateToken };