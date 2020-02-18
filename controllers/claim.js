const User = require("../Models/User");
const Claim = require("../Models/Claim");


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



exports.createClaim=(req,res,next)=>{
console.log(req.body.id)
    User.findById(req.body.id).then(user=>{
        if(user) {

            const claim = new Claim({
                content     : req.body.content,
                type        : "Normal",
                created_at  : new Date(),
                status      : "Completed",
                user        : user,

            });
            claim.save()
                .then(claim=> {

                    //console.log("ok");
                    res.status(200).json({
                        message: "Claim created successfully!",
                        result: claim
                    });

                }).catch(err => {
                // console.log(err);
                res.status(500).json({
                    error: err
                });
            });

        }
        }).catch(err => {
        // console.log(err);
        res.status(500).json({
            error: err
        });
    });


};


exports.AllClaims=(req,res,next)=>{

    return Claim.find().sort({_id:-1})
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));

}


exports.MyClaims=(req,res,next)=>{
    console.log("Claims by user id ")



}

exports.getClaim = ( req, res, next) =>{
    var id = req.body.id;
    console.log("user claim id ",req.body  )

    Claim.findById(id)
        .exec().then((claim) =>{
        if (claim){
            console.log(claim)
                User.findById(claim.user._id).exec().then(user =>{
                if(user){
                    console.log(user)
                    claim.user.balance = user.balance;
                    return    claim.save().then(respondWithResult(res)).catch(handleError(res));
                }
            })
        }
        }).catch(handleError(res));
};


exports.UpdateClaim = (req, res, next) => {

    Claim.findById(req.body._id).then(claim=>{
        if(claim){
            claim.status = req.body.status

            return claim.save().then(respondWithResult(res))
                .catch(handleError(res));
        }

    }).catch(handleError(res));







};

exports.deleteClaimById = (req, res, next) => {

    return Claim.findById(req.params.id).exec()
        .then(entity => {

            entity.remove()
                .then(entity =>{

                    Claim.find().sort({_id:-1})
                        .exec()
                        .then(respondWithResult(res))
                })
                .catch(handleError(res));
        })



};