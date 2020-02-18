const User = require("./User").schema;
const Product = require("./Product").schema;

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);




const MessageSchema = mongoose.Schema({

    content    : { type: String  },
    sender     : User,
    receiver   : User,
    product    : Product,
    seen       : { type: Number, default: 0 },
    created_at : { type: Date },

});


module.exports = mongoose.model("Message", MessageSchema);
