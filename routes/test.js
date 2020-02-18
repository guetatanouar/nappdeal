const express = require("express");

const TestController = require("../controllers/test");
 
//const authCheck = require("../middleware/check-auth");

const router = express.Router();

router.post("/createTest", TestController.createTest);
router.get("/searchTest", TestController.searchTest);


module.exports = router;
