const mongoose     = require('mongoose');
var mexp = require('mongoose-elasticsearch-xp').v2;

const mongoosastic = require('mongoosastic');

//mongoose.connect('mongodb://localhost:27017/mongosync');

var TestSchema = new mongoose.Schema({

    active: { type: Boolean, es_indexed: true},
    description   :{ type: String , es_indexed: true},
    images: [],
    name:  { type: String, required: true , es_indexed: true},
    price:{ type: Number  , es_indexed: true},
    address   :{ type: String  , es_indexed: true},
    phone   :{ type: String  , es_indexed: true},
    type   :{ type: String  , es_indexed: true},
    url   :{ type: String  , es_indexed: true},
    created_at : { type : Date, es_indexed: true},
    location : { type:Object,es_type: 'geo_point', index: '2dsphere',es_lat_lon: true, es_indexed: true},
});

TestSchema.plugin(mexp, {
    "host": "nappdeal.com",
    "port": 9200
});

module.exports = mongoose.model('test', TestSchema);


