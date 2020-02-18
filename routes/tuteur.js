const express = require("express");

const TuteurController = require("../controllers/Tuteur");
const UserController = require("../controllers/user");

const authCheck = require("../middleware/check-auth");

const router = express.Router();

router.post("/signup", TuteurController.createUser);
router.post("/signupSocialMedia", TuteurController.signupSocialMedia);
router.post("/AddPhoneToProfile", UserController.UpdatePohne);

 router.post("/login", TuteurController.userLogin);
 router.post("/loginVerifCode", UserController.loginVerifCode);

router.put("/SignUpWithphone", UserController.SignUpWithphone);
router.get("/allUser", TuteurController.getUsers);
router.post("/getUser", TuteurController.getUser);
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



router.delete("/undoArchive",authCheck, UserController.UndoarchiveTransaction);
router.post("/mailed", UserController.mailing);
router.post("/UpdatePassword", UserController.UpdatePassword);
router.post("/UpdateStudent", TuteurController.UpdateStudent);


module.exports = router;
