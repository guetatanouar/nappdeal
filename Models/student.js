const mongoose = require("mongoose");


const StudentSchema = mongoose.Schema({
    name: { type: String},
    age: { type: String},
    gender: { type: String  },
    avancement: { type: String },
});


module.exports = mongoose.model("Student", StudentSchema);
