const express = require("express");

const UserController = require("../controllers/user");
 
const authCheck = require("../middleware/check-auth");

const router = express.Router();

router.post("/signup", UserController.createUser);
router.post("/signupSocialMedia", UserController.signupSocialMedia);
router.post("/AddPhoneToProfile", UserController.UpdatePohne);

 router.post("/login", UserController.userLogin);
 router.post("/loginVerifCode", UserController.loginVerifCode);

router.put("/SignUpWithphone", UserController.SignUpWithphone);
router.get("/allUser", UserController.getUsers);
router.post("/getUser", UserController.getUser);
router.put("/editUser", UserController.UpdateUser);

router.post("/UserRecharges", UserController.RechargesByUserId);
router.post("/UserTransactions",authCheck, UserController.TransactionsByUserId);
router.post("/UserClaims", UserController.ClaimsByUserId);

router.post("/UserTransactionsTest", UserController.TransactionsByUserIdTest);


router.post("/TransfertMoney",authCheck, UserController.TransfertMoney);

router.post("/disactiveUser/:id", UserController.disactiveUser);
router.post("/activeUser", UserController.activeUser);

router.post('/deleteUserById/:id',UserController.deleteUserById);


router.post('/sendPhoneVerifOnSignUp',UserController.sendPhoneVerifOnSignUp);

router.post("/fetchUserByID", UserController.fetchUserByID);


router.delete("/archiveTransaction",authCheck, UserController.archiveTransaction);
router.post("/deleteTransactionById",authCheck, UserController.deleteTransactionById);
router.post("/deleteRechargeById",authCheck, UserController.deleteRechargeById);
router.post("/deleteClaimById",authCheck, UserController.deleteClaimById);

router.delete("/undoArchive",authCheck, UserController.UndoarchiveTransaction);
router.post("/mailed", UserController.mailing);
router.post("/UpdatePassword", UserController.UpdatePassword);


module.exports = router;
