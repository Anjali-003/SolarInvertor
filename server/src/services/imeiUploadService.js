const pool = require("../config/database");

exports.processIMEIs = async (imeis) => {

    let connection;

    try {

        connection = await pool.getConnection();

        await connection.beginTransaction();

        // ----------------------------------
        // Remove duplicates inside Excel
        // ----------------------------------

        const seen = new Set();

        const duplicateInExcelList = [];

        const uniqueIMEIs = [];

        for (const imei of imeis) {

            if (seen.has(imei)) {

                if (!duplicateInExcelList.includes(imei)) {

                    duplicateInExcelList.push(imei);

                }

            } else {

                seen.add(imei);

                uniqueIMEIs.push(imei);

            }

        }

        // ----------------------------------
        // Validate IMEIs
        // ----------------------------------

        const invalidList = [];

        const validIMEIs = uniqueIMEIs.filter((imei) => {

            const valid = /^\d{15}$/.test(imei);

            if (!valid) {

                invalidList.push(imei);

            }

            return valid;

        });

        // ----------------------------------
        // Nothing valid
        // ----------------------------------

        if (validIMEIs.length === 0) {

            await connection.commit();

            return {

                duplicateInExcel:
                    duplicateInExcelList.length,

                duplicateInExcelList,

                invalidIMEIs:
                    invalidList.length,

                invalidList,

                alreadyInDatabase: 0,

                existingList: [],

                inserted: 0

            };

        }

        // ----------------------------------
        // Check existing IMEIs
        // ----------------------------------

        const placeholders =
            validIMEIs.map(() => "?").join(",");

        const [rows] = await connection.execute(

            `
            SELECT imei
            FROM imei_list
            WHERE imei IN (${placeholders})
            `,

            validIMEIs

        );

        const existingList =
            rows.map(row => row.imei);

        const existingSet =
            new Set(existingList);

        // ----------------------------------
        // Keep only new IMEIs
        // ----------------------------------

        const newIMEIs =
            validIMEIs.filter(

                imei => !existingSet.has(imei)

            );

        // ----------------------------------
        // Bulk Insert
        // ----------------------------------

        if (newIMEIs.length > 0) {

            const values =
                newIMEIs.map(
                    imei => [imei]
                );

            await connection.query(

                `
                INSERT INTO imei_list (imei)
                VALUES ?
                `,

                [values]

            );

        }

        await connection.commit();

        return {

            duplicateInExcel:
                duplicateInExcelList.length,

            duplicateInExcelList,

            invalidIMEIs:
                invalidList.length,

            invalidList,

            alreadyInDatabase:
                existingList.length,

            existingList,

            inserted:
                newIMEIs.length

        };

    }

    catch (err) {

        if (connection) {

            await connection.rollback();

        }

        throw err;

    }

    finally {

        if (connection) {

            connection.release();

        }

    }

};