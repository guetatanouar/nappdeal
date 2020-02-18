

const User = require("../Models/User");
const Product = require("../Models/Product");
const Message = require("../Models/Message");



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


exports.createMessage =  async (req, res, next) => {
    //console.log("req.bodyreq.bodyreq.bodyreq.body",req.body)
    User.findById(req.body.receiver).then(user=>{
        if(user){
            User.findById(req.body.sender).then(sender=>{
                Product.findById(req.body.product).then(product=>{
                    const message = new Message({
                        content:  req.body.content,
                        sender     :sender,
                        receiver   : user,
                        product    : product,
                        seen       :1,
                        created_at :new Date(),
                    });
                    message.save()
                        .then(message =>{
                            res.status(200).json({
                                message: "message created successfully!",
                                result: message
                            });
                        }).catch(handleError(res));
                }).catch(handleError(res));
            }).catch(handleError(res));
        }
    }).catch(handleError(res));
};
exports.MessageByProductId = (req, res, next) => {

  Message.find({$or : [{"product._id" : req.body.id ,"sender._id" : req.body.receiver , "receiver._id" : req.body.sender  },{"product._id" : req.body.id ,"receiver._id" : req.body.receiver , "sender._id" : req.body.sender  }]})
         .sort({_id:-1})
        .then( messages => {

            res.status(200).json({
                message: "Messages by product Id !!!! ",
                result: messages ,
            });
        }).catch(handleError(res));

};


exports.MessageByUserId = (req, res, next) => {

    Message.find({$or : [{"sender._id" : req.body.id },{"receiver._id" : req.body.id }]})
        .sort({created_at:1}).exec()
        .then( messages => {

            res.status(200).json({
                message: "Messages by product Id !!!! ",
                result: messages ,
            });
        }).catch(handleError(res));

};





exports.getNotification = (req, res, next) => {

    Message.find({$and : [{"receiver._id" : req.body.id} , {seen : 1}]}).exec()

        .then( messages => {

            res.status(200).json({
                message: "Messages by product Id !!!! ",
                result: messages ,
            });
        }).catch(handleError(res));

};




exports.updateNotif = (req, res, next) => {

  //  return
    Message.find({"receiver._id" : req.body.id }).exec()
        .then(entity =>{
            //console.log("entityentityentityentity",entity)
            for(let i=0;i<entity.length;i++){
                Message.updateOne({_id:entity[i]._id},   { $set: { "seen": 0 } }).exec()
                    .then(result=>{
                       return Message.find()
                            .exec()
                            .then(respondWithResult(res))
                           .catch(handleError(res));
                    }) .catch(handleError(res));


            }

        }) .catch(handleError(res));

    };

exports.UpdateNotification2 = (req, res, next) => {

    //  return
    Message.find({$and : [{"product._id" : req.body.post },{"sender._id" : req.body.id }]}).exec()
        .then(entity =>{
            //console.log("entityentityentityentity",entity)
            for(let i=0;i<entity.length;i++){
                Message.updateOne({_id:entity[i]._id},   { $set: { "seen": 0 } }).exec()
                    .then(result=>{
                        return Message.find()
                            .exec()
                            .then(respondWithResult(res))
                            .catch(handleError(res));
                    }) .catch(handleError(res));


            }

        }) .catch(handleError(res));

};
exports.MessageByUserIdAndProductID = (req, res, next) => {

    Message.find({$and : [{"product._id" : req.body.post._id },{$or : [{"sender._id" : req.body.id },{"receiver._id" : req.body.id }]}]})
        .sort({_id:1})
        .then( messages => {
             res.status(200).json({
                message: "Messages by product Id !!!! ",
                result: messages ,
            });
        })

};


exports.getMessages = (req, res, next) => {
    Message.find().exec() .then(respondWithResult(res))
        .catch(handleError(res));
}

 exports.getProducts = (req, res, next) => {
     let pro = []


   Message.find().exec().then(msgs =>{

            if(msgs)

                msgs.map(item =>{
                       console.log("item",item.product)
                    pro.push(item.product)
                })
       console.log("pro",pro.length)

       // Declare a new arrayyy
       let newArray = [];

       // Declare an empty object
       let uniqueObject = {};

       // Loop for the array elements
       for (let i in pro) {
console.log("pro iii",pro[i])
           // Extract the title
         let  objTitle = pro[i]['_id'];

           // Use the title as the index
           uniqueObject[objTitle] = pro[i];
       }

       // Loop to push unique object into array
       for (let i in uniqueObject) {
           newArray.push(uniqueObject[i]);
       }

       // Display the unique objects
       console.log(newArray);
       console.log("longggg",newArray.length);


       res.status(200).json({
           message: "List product have chat!!!! ",
           result: newArray ,
       });
        })


};


exports.MessagesByProductId = (req, res, next) => {
    console.log("body", req.body)
    let myMessages = [];



            Message.find().then(msgs => {
                if (msgs) {
                    //  console.log(claims)
                    msgs.map(e => {

                        if (e.product.id === req.body.contactId) {
                            console.log(e)
                            myMessages.push(e)

                        }
                    })
                    res.status(200).json({
                        message: "My Messages by product id  !!!! ",
                        result: myMessages,
                    });

                }
            })




}



exports.LastMessageByProductId = (req, res, next) => {
    console.log("body", req.body)
    let myMessages = [];

    Product.findById(req.body.contactId).then(product => {
        if (product) {
            console.log(product)

            Message.find().then(msgs => {
                if (msgs) {
                    //  console.log(claims)
                    msgs.map(e => {

                        if (e.product.id === product.id) {
                           // console.log(e)
                            myMessages.push(e)

                        }
                    })
                    let lastMsg= myMessages.reverse()[0];

                   console.log("last message",lastMsg)

                    res.status(200).json({
                        message: "Last Message by product id  !!!! ",
                        result: lastMsg,
                    });

                }
            })
        }
    }).catch(handleError(res));


}


exports.deleteMessageById = (req, res, next) => {
    console.log('id',req.body.id)

    return Message.findById(req.body.id).exec()
        .then(entity => {
            console.log('entityentity',entity)

            entity.remove()
                .then(result =>{
                    console.log('resultresultresult',result)
                    res.status(200).json({
                        message:result,
                        success: true,
                    });
                })
                .catch(handleError(res));
        })




};



exports.DeleteMessageByProduct=(req, res, next) => {
    console.log('id',req.body.id)

    return Message.find({$and : [{"product._id":req.body.id} , {$or: [ { "sender._id":req.body.user }, {"receiver._id":req.body.user  }]}]}).exec()
        .then(entity => {
            for(let i=0;i<entity.length;i++){
                entity[i].remove()
            }
            //console.log('entityentity',entity.length)

            entity.remove()
                .then(result =>{
                    console.log('resultresultresult',result)
                    res.status(200).json({
                        message:result,
                        success: true,
                    });
                })
                .catch(handleError(res));
        })
        .catch(handleError(res));



};