const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


const notificationSchema = mongoose.Schema({

    content   :{ type: String },
    created_at: { type: Date },
    avatar: { type: String },
    product: { type: String },
    user: { type: String },
    unread:{ type: Boolean , default: true},

});

notificationSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Notification", notificationSchema);
