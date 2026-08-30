// const jwt = require("jsonwebtoken");

// module.exports = (req,res,next)=>{

//     try{

//         const token =
//             req.headers.authorization
//             ?.split(" ")[1];

//         const decoded =
//             jwt.verify(
//                 token,
//                 process.env.JWT_SECRET
//             );

//         if(decoded.type !== "vendor"){

//             return res.status(403).json({
//                 error:"Vendor access only"
//             });
//         }

//         req.vendor = decoded;

//         next();

//     }
//     catch{

//         return res.status(401).json({
//             error:"Unauthorized"
//         });
//     }
// };



const jwt = require("jsonwebtoken");
const pool = require("../config/database");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // -------------------------------------------------
    // ENSURE THIS IS A VENDOR TOKEN
    // -------------------------------------------------

    if (decoded.type !== "vendor") {
      return res.status(403).json({
        error: "Vendor access required",
      });
    }

    // -------------------------------------------------
    // GET CURRENT VENDOR
    // -------------------------------------------------

    const [vendors] = await pool.execute(
      `
      SELECT
        id,
        name,
        email,
        phone,
        status,
        email_verified,
        token_version
      FROM vendors
      WHERE id = ?
      LIMIT 1
      `,
      [decoded.id]
    );

    if (vendors.length === 0) {
      return res.status(401).json({
        error: "Vendor account not found",
      });
    }

    const vendor = vendors[0];

    // -------------------------------------------------
    // CHECK TOKEN VERSION
    // -------------------------------------------------

    if (
      decoded.tokenVersion !==
      vendor.token_version
    ) {
      return res.status(401).json({
        error:
          "Session expired. Please login again.",
      });
    }

    // -------------------------------------------------
    // CHECK ACCOUNT STATUS
    // -------------------------------------------------

    if (vendor.status === "suspended") {
      return res.status(403).json({
        error:
          "Your vendor account has been suspended.",
      });
    }

    if (vendor.status === "rejected") {
      return res.status(403).json({
        error:
          "Your vendor account has been rejected.",
      });
    }

    // -------------------------------------------------
    // ATTACH VENDOR TO REQUEST
    // -------------------------------------------------

    req.vendor = vendor;

    next();

  } catch (error) {
    console.error(
      "VENDOR AUTH ERROR:",
      error
    );

    return res.status(401).json({
      error:
        "Invalid or expired authentication token",
    });
  }
};