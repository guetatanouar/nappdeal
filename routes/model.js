const express = require("express");

const MakeController = require("../controllers/model");

//const authCheck = require("../middleware/check-auth");

const router = express.Router();
router.post("/getModelByMake", MakeController.getModelByMake);
router.get("/AllModels", MakeController.AllModels);
//router.get("/ClaimsByUserId",authCheck, ClaimController.MyClaims);

//router.post("/getClaim", ClaimController.getClaim);

//router.put("/editClaim", ClaimController.UpdateClaim);

//router.post('/deleteClaimById/:id',ClaimController.deleteClaimById);


module.exports = router;