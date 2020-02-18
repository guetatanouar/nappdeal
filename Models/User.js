const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    uuid: { type: String},
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: false },
    profileImage: { type: String },
    balance: { type: Number, default: 0 },
    role: { type: String, required: true },
    status: { type: Boolean,   default:true },
    password: { type: String  },

    active: { type: Boolean ,  default: true  },

    friends: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    provider: { type: String  },
    providerID: { type: String  },
    lat: { type: Number },
    lng: { type: Number },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
