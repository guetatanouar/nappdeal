const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
        req.userData = {
            uuid:decodedToken.uuid,
            email: decodedToken.email,
            userId: decodedToken.userId,
            username: decodedToken.username,
            role: decodedToken.role,
            type: decodedToken.type,
            profileImage: decodedToken.profileImage,
            phoneNumber:decodedToken.phoneNumber,
            balance: decodedToken.balance
        };
        next();
    } catch (error) {
        res.status(401).json({message: "You are not authenticated!"});
    }
};
