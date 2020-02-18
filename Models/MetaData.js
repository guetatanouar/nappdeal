const mongoose = require("mongoose");



const MetaDataSchema = mongoose.Schema({
    BodyType:{ type: String  },
    Color:{ type: String  },
    NumberDoors:{ type: Number  },
    NumberSeats:{ type: Number  },
    Transmission:{ type: String  },
    Make:{ type: String  },
    Modele:{ type: String  },
    FuelType:{ type: String  },
    ForSaleBy:{ type: String  },
    Kilometers:{ type: Number  },
    year:{ type: Number  },

});



//module.exports = mongoose.model("Variant", variantSchema);
module.exports = MetaDataSchema;
