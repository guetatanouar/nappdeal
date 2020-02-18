const User = require("./transactionUser");

const mongoose = require("mongoose");


const ClaimSchema = mongoose.Schema({
    content: { type: String },
    type: { type: String },
    user: User,
    status: { type: String  },
    created_at: { type: Date },



});


module.exports = mongoose.model("Claim", ClaimSchema);
