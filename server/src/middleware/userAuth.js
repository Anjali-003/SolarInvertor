const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{

    try{

        const token =
            req.headers.authorization
            ?.split(" ")[1];

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        if(decoded.type !== "user"){

            return res.status(403).json({
                error:"User access only"
            });
        }

        req.user = decoded;

        next();

    }
    catch{

        return res.status(401).json({
            error:"Unauthorized"
        });
    }
};