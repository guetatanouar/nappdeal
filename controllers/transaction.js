const User = require("../Models/User");

const Product = require("../Models/Product");
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




exports.createTransaction = (req, res, next) => {
Product.findById(req.body.productId).then(product => {
        if (product) {
            if (Number(req.body.user.balance) < Number(req.body.amount)) {
                console.log("1")
                res.status(204).json({
                    message: "Your balance is insufficient !!",
                    result: product
                });
            } else {
                console.log("update balnce and create transaction")
                console.log("prix produit =", Number(req.body.amount))
                console.log("balance 1 =", Number(req.body.user.balance))

                const bal = Number(req.body.user.balance) - Number(req.body.amount)
                const newBalance = Number(bal)
                console.log("balance 2 =", newBalance)
                //  User.updateOne({_id: req.body.user._id},   { $set: { "balance": newBalance } }).exec()
                User.findById(req.body.user._id)
                    .then(user => {
                        user.balance = newBalance;
                        user.save();
                        //console.log("balance update",entity)


                        const transaction = new Transaction({
                            type: 'Achat',
                            product: product,
                            amount: req.body.amount,
                            attachement: "attachement",
                            created_at: new Date(),
                            status: "completed",
                            user: user,
                            archived: false
                        });
                        transaction
                            .save()
                            .then(transaction => {
                                //console.log("ok");
                                console.log("5")
                                res.status(200).json({
                                    message: "Transaction created successfully!",
                                    result: transaction, user
                                });
                            })


                    })


            }

        } else {
            Product.findById(req.body.productId).then(product => {
                if (product) {
                    if (Number(req.body.user.balance) < Number(req.body.amount)) {
                        console.log("1")
                        res.status(204).json({
                            message: "Your balance is insufficient !!",
                            result: product
                        });
                    } else {
                        console.log("update balnce and create transaction")
                        console.log("prix produit =", Number(req.body.amount))
                        console.log("balance 1 =", Number(req.body.user.balance))

                        const bal = Number(req.body.user.balance) - Number(req.body.amount)
                        const newBalance = Number(bal)
                        console.log("balance 2 =", newBalance)
                        //  User.updateOne({_id: req.body.user._id},   { $set: { "balance": newBalance } }).exec()
                        User.findById(req.body.user._id)
                            .then(user => {
                                user.balance = newBalance;
                                user.save();
                                //console.log("balance update",entity)


                                const transaction = new Transaction({
                                    type: 'Achat',
                                    product: product,
                                    amount: req.body.amount,
                                    attachement: "attachement",
                                    created_at: new Date(),
                                    status: "completed",
                                    user: user,
                                    archived: false
                                });
                                transaction
                                    .save()
                                    .then(transaction => {
                                        //console.log("ok");
                                        console.log("5")
                                        res.status(200).json({
                                            message: "Transaction created successfully!",
                                            result: transaction, user
                                        });
                                    })


                            })


                    }

                } else {
                    res.status(204).json({
                        message: "product does not exist anymore",
                        result: product
                    });
                }
            })
                .catch(err => {
                    // console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });

        }
    })
}







exports.AddPost = (req, res, next) =>{
    User.findById(req.body.id).exec()
        .then((user)=>{

            const bal = Number(user.balance) - Number(req.body.amount)
            const newBalance = Number(bal)
            console.log("balance 2 =", newBalance)
            user.balance = newBalance;
            user.save()
        .then(result => {

                res.status(200).json({
                    message: "Transaction created successfully!",
                    user: user
                });
            })
        }).catch(handleError(res));


    /*.then(transaction => {
        if (user) {
            //transaction.archived = true;
           // transaction.save()
                .then(x => {
                    Transaction.find()
                        .then(result => {
                            res.status(200).json({
                                message: "transaction found and archived !",
                                result: result
                            });


                        })

                })

        } else {
            res.status(304).json({
                message: "transaction not modified !",
            });
        }
    })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });*/

}
    exports.archiveTransaction = (req, res, next) => {
    console.clear()
    console.log("archive tr")
    Transaction.findById(req.body.transactionId).then(transaction => {
        if (transaction) {
            transaction.archived = true;
            transaction.save()
                .then(x => {
                    Transaction.find()
                        .then(result => {
                            res.status(200).json({
                                message: "transaction found and archived !",
                                result: result
                            });


                        })

                })

        } else {
            res.status(304).json({
                message: "transaction not modified !",
            });
        }
    })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.UndoarchiveTransaction = (req, res, next) => {
    console.log("unarchive")
    Transaction.findById(req.body.transactionId).then(transaction => {
        if (transaction) {
            transaction.archived = false;
            transaction.save()
                .then(x => {
                    Transaction.find()
                        .then(result => {
                            res.status(200).json({
                                message: "transaction found and unarchived !",
                                result: result
                            });


                        })

                })

        } else {
            res.status(304).json({
                message: "transaction not modified !",
            });
        }
    })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.getArchived = (req, res, next) => {
    console.log("archived")
    Transaction.find({$and: [{user: req.userData.userId}, {archived: {$eq: true}}]})
        .then(result => {

            if (result) {
                res.status(200).json({
                    message: "All Archived!",
                    result: result,
                });
            } else {
                res.status(204).json({
                    message: "All Archived!",
                    result: result,
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
exports.getTransactions = (req, res, next) => {
    let mytr = []
    console.log("non archived")
    Transaction.find({archived: {$eq: false}})
        .then(result => {

            if (result) {
                //console.log("token user ",req.userData.userId)
                result.map(e => {
                    //console.log(e.user)
                    if (e.user._id.equals(req.userData.userId)) {

                        mytr.push(e)
                    }
                })

                res.status(200).json({
                    message: "my transactions!",
                    result: mytr,
                });
            } else {
                res.status(204).json({
                    message: "All transactions!",
                    result: result,
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
exports.getAllTransactions = (req, res, next) => {
    console.log("all")
    Transaction.find().sort({_id:-1})
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "All transactions!",
                    result: result,
                });
            } else {
                res.status(204).json({
                    message: "All transactions!",
                    result: result,
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
exports.getTransaction = (req, res, next) => {
    console.log("by id transaction")
    Transaction.findById(req.body.transactionId)
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "transaction found!",
                    result: result,
                });
            } else {
                res.status(204).json({
                    message: "no content!",
                    result: result,
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


exports.getTransactionById = (req, res, next) => {
    var id = req.body.id;
    console.log("bodyuuuu", id)
    return Transaction.findById(id)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}



