const mongoose = require("mongoose");



const variantSchema = mongoose.Schema({

    product:    {type: mongoose.Schema.ObjectId, ref: 'User'},
    price:      { type: Number  },
    description:      { type: String  },
});



module.exports = mongoose.model("Variant", variantSchema);
//module.exports = variantSchema;
