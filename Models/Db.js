const mongoose = require("mongoose");
mongoose
    .connect(
       "mongodb://admin:admin123@ds125945.mlab.com:25945/nappdeal?authSource=nappdeal",


         {useUnifiedTopology: true, useNewUrlParser: true}
    ).then(() => {        console.log("Connected to database successfully");
    })

    .catch(() => {
        console.log("Unable to connected to database");
    });
