const express = require("express");

const metadataController = require("../controllers/metadata");

const authCheck = require("../middleware/check-auth");

const router = express.Router();


router.post("/CreateMetaData", metadataController.createMetaData);


module.exports = router;
