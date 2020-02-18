
const Notification = require("../Models/Notification");



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

exports.createNotif = (req, res, next) => {

    var newNotif = new Notification({

        avatar: req.body.avatar,
        content: req.body.content,
        product: req.body.product,
        user: req.body.user,
        created_at : new Date(),

    });

    newNotif.save().then(n =>{
        res.status(200).json({
            success: true,
            message: "notification created successfully!",
            result: n
        });
    }).catch(handleError(res));

}

exports.allNotifs = ( req, res, next) =>{
    return Notification.find().limit(req.body.limit).sort({_id:-1})
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
};

exports.readNotif = ( req, res, next) =>{
    return  Notification.findById(req.body._id).then(notif=> {

        notif.unread = false;


        notif.save()
            .then(nt =>{
                Notification.find().sort({_id:-1})
                    .exec()
                    .then(respondWithResult(res))
                    .catch(handleError(res));
            })

    })
};










