const Product = require("../Models/Product");
const MetaData = require("../Models/MetaData");

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

exports.createMetaData = (req, res, next) => {


            const metaData = new MetaData({

                BodyType:req.body.product,
                Color:req.body.product,
                NumberDoors: req.body.product,
                NumberSeats:req.body.product,
                Transmission:req.body.product,
                Make:req.body.product,
                Modele:req.body.product,
                FuelType:req.body.product,
                ForSaleBy:req.body.product,
                Kilometers:req.body.product,
                year:req.body.product,

            })
    metaData.save().then( variant => {

        MetaData.find({product: req.body.product}).exec().then( variants => {

                    Product.findById(req.body.product).then(product=>{
                        if(product){
                            res.status(200).json({
                                message: "product to update!",
                                result: product
                            });
                           product.variants = variants;
                            product.save()
                            //Product.updateOne({_id: product.id},   { $set: { "variants": product.variants } }).exec()

                                .then(entity =>{
                                    res.status(200).json({
                                        message: "Product variants updated successfully!",
                                        result: entity
                                    }).catch(handleError(res))

                                })

                        }
                        else{
                            res.status(200).json({
                                message: "Product not found!",
                            });
                        }
                    })


                })
            }).catch(handleError(res));




};


