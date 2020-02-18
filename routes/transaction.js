const express = require("express");

const TransactionController = require("../controllers/transaction");

const authCheck = require("../middleware/check-auth");

const router = express.Router();
router.post("/",authCheck, TransactionController.createTransaction);
router.delete("/",authCheck, TransactionController.archiveTransaction);
router.delete("/undoArchive",authCheck, TransactionController.UndoarchiveTransaction);
router.get("/",authCheck, TransactionController.getTransactions);
router.get("/Archivedtransaction",authCheck, TransactionController.getArchived);
router.get("/Alltransaction",authCheck, TransactionController.getAllTransactions);
router.post("/getTransaction",authCheck, TransactionController.getTransaction);
router.post("/getTransactionById",authCheck, TransactionController.getTransactionById);
router.post("/AddPost", TransactionController.AddPost);


module.exports = router;
