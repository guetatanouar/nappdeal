const User = require("./transactionUser");
const Product = require("./productTransaction");
const mongoose = require("mongoose");


const RechargeSchema = mongoose.Schema({
    user: User,
    created_at: { type: Date },
    amount: { type: Number },
    verification: { type: String },
    status: { type: String  }


});


module.exports = mongoose.model("Recharge", RechargeSchema);
