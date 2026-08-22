const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    try {

        const authHeader =
            req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        const token =
            authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        if (decoded.type !== "user") {
            return res.status(403).json({
                error: "Access denied"
            });
        }

        req.user = decoded;

        next();

    } catch (err) {

        return res.status(401).json({
            error: "Invalid or expired token"
        });
    }
};