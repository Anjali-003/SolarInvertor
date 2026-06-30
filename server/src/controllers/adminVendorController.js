const pool = require("../config/database");

exports.getPendingVendors = async (req, res) => {

    try {

        const [vendors] = await pool.execute(
            `
            SELECT
                id,
                name,
                email,
                phone,
                created_at
            FROM vendors
            WHERE status='pending'
            ORDER BY created_at ASC
            `
        );

        res.json(vendors);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to fetch pending vendors."
        });

    }

};

exports.approveVendor = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await pool.execute(
            `
            SELECT status
            FROM vendors
            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Vendor not found."
            });
        }

        const vendor = rows[0];

        if (vendor.status === "approved") {
            return res.status(400).json({
                error: "Vendor is already approved."
            });
        }

        if (vendor.status === "rejected") {
            return res.status(400).json({
                error: "Rejected vendors cannot be approved. Register the vendor again if approval is required."
            });
        }

        await pool.execute(
            `
            UPDATE vendors
            SET status='approved'
            WHERE id=?
            `,
            [id]
        );

        res.json({
            success: true,
            message: "Vendor approved successfully."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to approve vendor."
        });

    }

};

exports.rejectVendor = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await pool.execute(
            `
            SELECT status
            FROM vendors
            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Vendor not found."
            });
        }

        const vendor = rows[0];

        if (vendor.status === "rejected") {
            return res.status(400).json({
                error: "Vendor is already rejected."
            });
        }

        if (vendor.status === "approved") {
            return res.status(400).json({
                error: "Approved vendors cannot be rejected."
            });
        }

        await pool.execute(
            `
            UPDATE vendors
            SET status='rejected'
            WHERE id=?
            `,
            [id]
        );

        res.json({
            success: true,
            message: "Vendor rejected successfully."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to reject vendor."
        });

    }

};