// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {

//     try {

//         const authHeader =
//             req.headers.authorization;

//         if (!authHeader) {
//             return res.status(401).json({
//                 error: "Unauthorized"
//             });
//         }

//         const token =
//             authHeader.split(" ")[1];

//         if (!token) {
//             return res.status(401).json({
//                 error: "Unauthorized"
//             });
//         }

//         const decoded =
//             jwt.verify(
//                 token,
//                 process.env.JWT_SECRET
//             );

//         if (decoded.type !== "user") {
//             return res.status(403).json({
//                 error: "Access denied"
//             });
//         }

//         req.user = decoded;

//         next();

//     } catch (err) {

//         return res.status(401).json({
//             error: "Invalid or expired token"
//         });
//     }
// };





const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Token expired",
        });
      }

      return res.status(401).json({
        error: "Invalid token",
      });
    }

    if (!decoded.id || decoded.type !== "user") {
      return res.status(401).json({
        error: "Invalid authentication token",
      });
    }

    const [rows] = await pool.execute(
      `
      SELECT
        id,
        name,
        email,
        phone,
        token_version
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    const user = rows[0];

    /*
     * IMPORTANT:
     *
     * If password reset incremented token_version,
     * all previously issued JWTs will now fail here.
     */
    if (
      decoded.tokenVersion !== user.token_version
    ) {
      return res.status(401).json({
        error: "Session expired. Please login again.",
        sessionInvalidated: true,
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    };

    next();

  } catch (error) {
    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error
    );

    return res.status(500).json({
      error: "Authentication failed",
    });
  }
};

module.exports = authenticateUser;