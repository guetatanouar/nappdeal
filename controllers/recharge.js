const Recharge = require("../Models/Recharge");
const User = require("../Models/User");
const Transaction = require("../Models/Transaction");

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

exports.createRecharge = (req, res, next) => {
console.log("body", req.body)
    User.findById(req.body.id).then(user=>{
        if(user){
            console.log("balance",typeof (user.balance))
            const bal = Number(req.body.amount)
            user.balance += bal;

            console.log(" new balance",user.balance)
           User.updateOne({_id:user._id},   { $set: { "balance": user.balance } }).exec()



            const recharge=new Recharge({
                user: user,
                created_at: new Date(),
                verification: "Completed",
                status:"Completed",
                amount:req.body.amount
            });


            recharge
                .save()
                .then(recharge=> {

                    const transaction=new Transaction({
                        type:"Recharge",
                        amount: req.body.amount,
                        created_at: new Date(),
                        status: "completed",
                        user:user,
                        to: user,
                        from:user,
                        archived:false
                    });
                    transaction.save()
                        .then(transaction=>{
                            res.status(200).json({
                                message: "Recharge created successfully!",
                                recharge: recharge,
                                transaction: transaction,
                               // user:user

                            });
                        })

                }).catch(handleError(res));
        }
        else{
            res.status(204).json({
                message: "user does not exist anymore",
                result: user
            });
        }
    })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });



};


exports.getAllRecharges=(req,res,next)=>{
    Recharge.find().sort({_id:-1})
        .then(result => {

            if(result){
                res.status(200).json({
                    message: "All Recharge!",
                    result: result ,
                });
            }
            else {
                res.status(204).json({
                    message: "All Recharge!",
                    result: result ,
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.deleteRechargeById = (req, res, next) => {

    return Recharge.findById(req.params.id).exec()
        .then(entity => {

            entity.remove()
                .then(entity =>{

                    Recharge.find().sort({_id:-1})
                        .exec()
                        .then(respondWithResult(res))
                })
                .catch(handleError(res));
        })



};