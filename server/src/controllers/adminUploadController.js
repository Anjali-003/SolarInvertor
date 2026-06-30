const ExcelJS = require("exceljs");
const fs = require("fs");

const {
    processIMEIs
} = require("../services/imeiUploadService");

exports.uploadIMEIs = async (req, res) => {

    let filePath = null;

    try {

        if (!req.file) {

            return res.status(400).json({

                error:
                    "Please upload an Excel file."

            });

        }

        filePath = req.file.path;

        const workbook =
            new ExcelJS.Workbook();

        await workbook.xlsx.readFile(filePath);

        const worksheet =
            workbook.getWorksheet(1);

        const imeis = [];

        worksheet.eachRow((row) => {

            const imei =
                String(
                    row.getCell(1).value || ""
                ).trim();

            if (imei !== "") {

                imeis.push(imei);

            }

        });

        const result =
            await processIMEIs(imeis);

        return res.json({

            success: true,

            totalRows:
                imeis.length,

            duplicateInExcel:
                result.duplicateInExcel,

            duplicateInExcelList:
                result.duplicateInExcelList,

            invalidIMEIs:
                result.invalidIMEIs,

            invalidList:
                result.invalidList,

            alreadyInDatabase:
                result.alreadyInDatabase,

            existingList:
                result.existingList,

            inserted:
                result.inserted

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            error:
                "Failed to process Excel file."

        });

    }

    finally {

        if (

            filePath &&
            fs.existsSync(filePath)

        ) {

            fs.unlinkSync(filePath);

            

        }

    }

};