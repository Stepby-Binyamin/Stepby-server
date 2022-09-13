const jwt = require("jsonwebtoken");


const authJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        console.log(authHeader);
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, verifyToken) => {
            if (err) {
                return res.sendStatus(403);
            }
            req._id = verifyToken._id;
            console.log(req._id);
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
module.exports = { authJWT };