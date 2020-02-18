const express = require("express");

const MakeController = require("../controllers/make");

//const authCheck = require("../middleware/check-auth");

const router = express.Router();
router.post("/createMake", MakeController.createMake);
router.get("/AllMakes", MakeController.AllMakes);
//router.get("/ClaimsByUserId",authCheck, ClaimController.MyClaims);

//router.post("/getClaim", ClaimController.getClaim);

//router.put("/editClaim", ClaimController.UpdateClaim);

//router.post('/deleteClaimById/:id',ClaimController.deleteClaimById);


module.exports = router;