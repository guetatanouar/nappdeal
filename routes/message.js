const express = require("express");

const MessageController = require("../controllers/message");

const authCheck = require("../middleware/check-auth");

const router = express.Router();


router.post("/createMessage", MessageController.createMessage);
router.post("/messageByProductId", MessageController.MessageByProductId);
router.post("/MessageByUserId", MessageController.MessageByUserId);
router.post("/MessageByUserIdAndProductID", MessageController.MessageByUserIdAndProductID);
//router.post("/updateNotif", MessageController.updateNotif);
router.post("/updateNotif", MessageController.UpdateNotification2);

router.post("/getNotification", MessageController.getNotification);

router.post("/MessagesProduct", MessageController.MessagesByProductId);

router.post("/LastMessageByProductId", MessageController.LastMessageByProductId);

router.get("/getMessages", MessageController.getMessages);
router.post('/deleteMessageById',MessageController.deleteMessageById);
router.post("/DeleteMessageByProduct", MessageController.DeleteMessageByProduct);

router.get("/getProducts", MessageController.getProducts);


//router.post("/MessagesBy", MessageController.getMessages);


module.exports = router;
