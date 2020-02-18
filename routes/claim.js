const express = require("express");

const ClaimController = require("../controllers/claim");

const authCheck = require("../middleware/check-auth");

const router = express.Router();
router.post("/createClaim",authCheck, ClaimController.createClaim);
router.get("/AllClaims", ClaimController.AllClaims);
router.get("/ClaimsByUserId",authCheck, ClaimController.MyClaims);

router.post("/getClaim", ClaimController.getClaim);

router.put("/editClaim", ClaimController.UpdateClaim);

router.post('/deleteClaimById/:id',ClaimController.deleteClaimById);


module.exports = router;