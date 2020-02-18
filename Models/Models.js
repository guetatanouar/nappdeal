const mongoose = require("mongoose");


const ModelSchema = mongoose.Schema({
    model: { type: String },
    make_id: { type: String }



});


module.exports = mongoose.model("Models", ModelSchema);