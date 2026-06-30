const jwt =
  require("jsonwebtoken");

const bcrypt =
  require("bcryptjs");

const pool =
  require("../config/database");

exports.login =
  async (req, res) => {

    try {

            const {
                email,
                password
            } = req.body;

            const [rows] =
            await pool.execute(
            `
            SELECT *
            FROM admins
            WHERE email = ?
            `,
            [email]
            );

            if (rows.length === 0) {
                return res.status(401).json({
                error: "Invalid credentials"
                });
            }

            const admin = rows[0];

            const valid =
            await bcrypt.compare(
            password,
            admin.password
            );

            if (!valid) {
                return res.status(401).json({
                error: "Invalid credentials"
                });
            }

            const token =
            jwt.sign(
                {
                id: admin.id,
                type: "admin"
                },
                process.env.JWT_SECRET,
                {
                expiresIn: "7d"
                }
            );

            res.json({
                token,
                admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email
                }
            });

        } catch (err) {

            console.log(err);

            res.status(500).json({
            error: err.message
            });

        }   
};