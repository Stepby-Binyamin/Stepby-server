const jwt = require("jsonwebtoken");
const { readOne } = require("../user/user.model");


const authJWT = async (req, res, next) => {
    // const newToken = jwt.sign({ _id: "631ee9f9d86c3d2ab5a08814" }, process.env.JWT_SECRET, { expiresIn: "10h" })
    //TODO: delete --- || `Bearer ${newToken}`; ---  before production.

    const authHeader = req.headers.authorization //|| `Bearer ${newToken}`;
    console.log(1234567, authHeader);

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(11, verifyToken);
        req.user = await readOne({ _id: verifyToken._id });
        console.log(15, req.user);
           if (req.user) next()
    } else {
        res.sendStatus(401);
    }
};


module.exports = { authJWT };