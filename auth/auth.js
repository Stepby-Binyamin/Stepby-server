const jwt = require("jsonwebtoken");
const { readOne } = require("../user/user.model");


const authJWT = async (req, res, next) => {
    const newToken = jwt.sign({ _id: "631f535f76a1bb19c3e0e309" }, process.env.JWT_SECRET, { expiresIn: "10h" })
    //TODO: delete --- || `Bearer ${newToken}`; ---  before production.
    const authHeader = req.headers.authorization || `Bearer ${newToken}`; 

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await readOne({ _id: verifyToken._id });

        next();
    } else {
        res.sendStatus(401);
    }
};
module.exports = { authJWT };