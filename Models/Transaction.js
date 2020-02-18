const User = require("./transactionUser");
const Product = require("./productTransaction");
const mongoose = require("mongoose");


const TransactionSchema = mongoose.Schema({
    type: { type: String},
    attachement: { type: String},
    product: Product,
    created_at: { type: Date },
    amount: { type: Number },
    verification: { type: String },
    status: { type: String  },
    user: User,
    from : User,
    to: User,
    archived:{type:Boolean}


});


module.exports = mongoose.model("Transaction", TransactionSchema);
