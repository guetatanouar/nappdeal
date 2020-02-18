const MetaData = require("./MetaData");
const Category = require("./categoryProduct");
const User = require("./transactionUser");

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', true   );
mongoose.set('useCreateIndex', true);


var mexp = require('mongoose-elasticsearch-xp').v2;
mongoose
const ProductSchema = mongoose.Schema({

  active: { type: Boolean , es_indexed: true},
  description   :{ type: String , es_indexed: true},
  images: { type: [String] ,default:[], es_indexed: true},
  name:  { type: String, required: true , es_indexed: true},
  price:{ type: Number  , es_indexed: true},
  address   :{ type: String  , es_indexed: true},
  phone   :{ type: String  , es_indexed: true},
  type   :{ type: String  , es_indexed: true},
  url   :{ type: String  , es_indexed: true},
  created_at : { type : Date, es_indexed: true},
  location : { type:Object,es_type: 'geo_point', index: '2dsphere',es_lat_lon: true, es_indexed: true},
  metaData:   { type: MetaData, es_indexed: true },
  user: { type: User, es_indexed: true },
  category: { type: Category, es_indexed: true },
  devise   :{ type: String  , es_indexed: true},
  viewed   :{ type: Number  ,default:0, es_indexed: true},
  cats:{ type: [String] ,default:[], es_indexed: false},


});



ProductSchema.plugin(mexp, {

    "host": "nappdeal.com",
    "port": 9200
})


module.exports = mongoose.model("Product", ProductSchema);
