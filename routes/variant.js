const express = require("express");

const VariantController = require("../controllers/variant");

const authCheck = require("../middleware/check-auth");

const router = express.Router();


router.post("/createvariant", VariantController.createVariant);


module.exports = router;
