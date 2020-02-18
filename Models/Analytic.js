const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


const analyticSchema = mongoose.Schema({

    visit: { type: Number, default: 1 },
    lat: { type: Number },
    lng: { type: Number },
    label   :{ type: String },
    created_at: { type: Date },
    platform: { type: String },

});

analyticSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Analytic", analyticSchema);
