// const express =
//     require("express");

// const router =
//     express.Router();

// const auth =
//     require(
//         "../middleware/authMiddleware"
//     );

// const reportController =
//     require(
//         "../controllers/reportController"
//     );


// router.get(
//     "/inverter-data",
//     auth,
//     reportController.downloadInverterReport
// );


// module.exports =
//     router;


const express =
    require("express");

const router =
    express.Router();

const auth =
    require(
        "../middleware/authMiddleware"
    );

const reportController =
    require(
        "../controllers/reportController"
    );


router.get(
    "/download",
    auth,
    reportController.downloadReport
);


module.exports =
    router;