const express = require("express");

const NotificationController = require("../controllers/notification");

//const authCheck = require("../middleware/check-auth");

const router = express.Router();

router.post("/createNotif", NotificationController.createNotif);
router.post("/allNotifs", NotificationController.allNotifs);
router.post("/readNotif", NotificationController.readNotif);





module.exports = router;
