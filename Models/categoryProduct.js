const mongoose = require("mongoose");

//const Variant = require("./variantProduct");


let Schema = mongoose.Schema;
const categoryProductSchema = mongoose.Schema({
    active: { type: Boolean  },
    categories: [],
    comparedPrice:{ type: Number  },
    depth:  { type: String  },
    description: { type: String  },
    descriptionAr   :{ type: String  },
    descriptionFr :{ type: String  },
    descriptionEn :{ type: String  },

    extraShippingFee:{ type: Number  },
    handle: { type: String  },
    height: { type: String  },
    images: [],
    name:  { type: String, required: true },
    priceTaxExcl:{ type: Number  },
    priceTaxIncl:{ type: Number  },
    quantity:{ type: Number  },
    sku: { type: String  },
    tags: [],
    taxRate:{ type: Number  },
    weight: { type: String  },
    width:{ type: String  },
    featuredImageId: { type: String  },
   // variants:  [Variant]

});


module.exports = categoryProductSchema;