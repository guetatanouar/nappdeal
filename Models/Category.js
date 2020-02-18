const Category = require("./Category");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//const Variant = require("./variantProduct");

const CategorySchema = mongoose.Schema({
    parent: Category,
    quantity:{ type: Number, default: 0   },
    active: { type: Boolean  },
    description   :{ type: String  },
    display   :{ type: String  },
    images: [],
    name:  { type: String, required: true },
    created_at: { type: Date },



});


module.exports = mongoose.model("Category", CategorySchema);
