//const User = require("./transactionUser");

const mongoose = require("mongoose");


const MakeSchema = mongoose.Schema({
    make: { type: String },
   // make_id: { type: String },

});


module.exports = mongoose.model("Makes", MakeSchema);