
const Test = require("../Models/Test");
var Pusher = require('pusher');


exports.createTest = (req, res, next) => {







    var newTest = new Test({
        active: true,
        description   :'d1',
        images: [],
        name:  'p2',
        price: 10,
        address   :'tunis',
        phone   :'12345678',
        type   :'type1',
        url   :'url1',
        created_at : new Date(),
        location : {"lat":45.509062,"lon":-73.553363}
    });

    newTest.save((err) => {
        if(err) {
            console.log(err);
        }
        console.log('user added in both the databases');
    })

    newTest.on('es-indexed', (err, result) => {
        console.log('indexed to elastic search',result);

    });


    var pusher = new Pusher({
        appId: '917680',
        key: '1967087ffc631dc33a74',
        secret: 'b0516971fb3f000d5f91',
        cluster: 'eu',
        encrypted: true
    });

    pusher.trigger('my-channel', 'my-event', {
        "message": newTest
    });


    }




exports.searchTest = (req, res, next) => {
/*let data ={"match": {
        "name": "Shahid"
    } }
    Test.search({
        query_string: {
            query: "Shahid"
        }
    }, function(err,results) {

        res.status(200).json({
            message: "get test successfully!",
            result: results
        });

})*/



Test.esSearch({
 /*   query: {
        bool: {
            must:  [
                {"match": {"name": "p2"}},
                ],
            filter: {range: {"price": {gte: 5}}}
        }
    },
    sort: [
        {"price": {order: "desc"}}
    ]*/


        query: {
        bool : {
            must : {
                match_all : {}
            },
            filter : {
                geo_distance : {
                    distance : "200km",
                        "location" : {
                        lat : 33.509062,
                        lon : 11.553363
                    }
                }
            }
        }
    }




   /* query: {
        bool: {

            filter: [
                {
                    geo_distance: {
                        "distance": "2km",
                        "coordinate": {
                            "lat": 45.509062,
                            "lon": -73.553363

                        }
                    }
                },
                {
                    range: {
                        "price": {
                            "gte": 5

                        }
                    }
                }

            ]
        }
    }*/


})

        .then(function (results) {
            // results here
            res.status(200).json({
                message: "get test successfully!",
                result: results
            });

        });


}




