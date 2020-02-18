const mongoose = require("mongoose");



let Schema = mongoose.Schema;
const transactionUserSchema = mongoose.Schema({
    name: { type: String },
    email: { type: String},
    phoneNumber: { type: Number },
    profileImage: { type: String },
    balance: { type: Number, default: 0 },
    role: { type: String},
    status: { type: Boolean},
    password: { type: String},
    active: { type: Boolean  },
    friends: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

module.exports = transactionUserSchema;