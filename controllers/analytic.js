
const Analytic = require("../Models/Analytic");
const Recharge = require("../Models/Recharge");
const Product = require("../Models/Product");


function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if(entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        res.status(statusCode).send(err);
    };
}

function handleEntityNotFound(res) {
    return function(entity) {
        if(!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}
function removeEntity(res) {
    return function(entity) {
        if(entity) {
            return entity.remove()
                .then(() => {
                    res.status(204).end();
                });
        }
    };
}

exports.createVisit = (req, res, next) => {

    var newVisit = new Analytic({
        lat: req.body.lat,
        lng: req.body.lng,
        label: req.body.label,
        platform: req.body.platform,

        created_at : new Date(),

    });

    newVisit.save((err) => {
        if(err) {
            console.log(err);
        }
        console.log('visit added in both the databases');
    })

}

exports.allVisits = ( req, res, next) =>{
    return Analytic.find().sort({_id:-1})
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
};


exports.getProductType = (req, res, next) => {

    Product.find().sort({_id:-1})
        .then(result => {
            let Featured=[];
            let Sponsored=[];
            let Daily=[];


            result.map((item)=>{
                if(item.type === "Featured"){
                    Featured.push(item)

                }else if(item.type === "Sponsored"){
                    Sponsored.push(item)

                }else{
                    Daily.push(item)
                }

              //  sum =sum +item.amount;
            })
            res.status(200).json({
                message: "All products!",
                result: result.length ,
                Featured:Featured,
                Sponsored:Sponsored,
                Daily:Daily
            });
        //  console.log(sum)
           /* if(result){

            }
            else {
                res.status(204).json({
                    message: "All Recharge!",
                    result: result ,
                });
            }*/
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });

};

exports.getRechargesSomme = (req, res, next) => {

        Recharge.find().sort({_id:-1})
            .then(result => {
                let sum=0;

                result.map((item)=>{

                    sum =sum +item.amount;
                })
                res.status(200).json({
                    message: "All Recharge!",
                    result: result.length ,
                    somme:sum
                });
                console.log(sum)
                /* if(result){

                 }
                 else {
                     res.status(204).json({
                         message: "All Recharge!",
                         result: result ,
                     });
                 }*/
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            });

};



exports.get5TopProductViewed = (req, res, next) => {
let Top =[]
   Product.find().sort({_id:-1}).then(products =>{
    Top =    products.sort((a, b) => b.viewed - a.viewed).slice(0,5)

        res.status(200).json({
            message: "Top 5 products!",
            result: Top ,

        });
   })

};





