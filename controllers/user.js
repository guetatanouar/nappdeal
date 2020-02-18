const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const Recharge = require("../Models/Recharge");
const Transaction = require("../Models/Transaction");
const Claim = require("../Models/Claim");
var accountSid = 'AC5899a0c71e8892bf416d370afed31c86'; // Your Account SID from www.twilio.com/console
var authToken = 'e34b62999d6c2d4d079695e5fecfbfb0';   // Your Auth Token from www.twilio.com/console
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);
var nodeMailer = require('nodemailer')



const  Sender = require("../config");
const  From = require("../config");

// Load facebookInput Validation
const validateLoginInput = require("../validation/login");


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



exports.SignUpWithphone = (req, res, next) => {
    let filter = {}
    if(req.body.provider == 'google'){
        filter = {googleId: req.body.googleId}
    }
    if(req.body.provider == 'facebook'){
        filter = {facebookId: req.body.facebookId}
    }
    console.log('filter',req.body.phoneNumber)
    return User.findOneAndUpdate(filter,  {$set: {phoneNumber: req.body.phoneNumber}}, { new: true,context: 'query',upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));

};

exports.fetchUserByID = (req, res, next) => {
       // console.log("req.body.id",req.body.id)
    User.find({_id:req.body.id}).then(result=>{
        res.status(200).json({
            success: true,
            user:result,
            //token: "Bearer " + token
        });


    })
        .catch(err => {
        console.log(err);
        return res.status(401).json({
            message: "Invalid authentication credentials!"
        });
    });

};


exports.loginVerifCode = (req, res, next) => {
    let fetchedUser;

    User.findOne({phoneNumber: req.body.phoneNumber})
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            fetchedUser = user;
            return req.body.verificationCode === user.verificationCode;
        })
        .then(result => {
            console.log("resuilt",result)
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            const token = jwt.sign(
                {
                    email: fetchedUser.email,
                    userId: fetchedUser._id,
                    username: fetchedUser.username,
                    role: fetchedUser.role,
                    profileImage: fetchedUser.profileImage,
                    balance: fetchedUser.balance,

                },
                "secret_this_should_be_longer",
                {expiresIn: "1h"}
            );
            res.status(200).json({
                success: true,
                user:fetchedUser,
                token: "Bearer " + token
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(401).json({
                message: "Invalid authentication credentials!"
            });
        });
};



exports.sendPhoneVerifOnSignUp = (req, res, next) => {
    var val = Math.floor(1000 + Math.random() * 9000);
    client.messages.create({
        body: 'Hello From E-wallet System Sign Up  ! Your Verification Code is : '+val,
        to: req.body.phoneNumber,  // Text this number
        from: '+19088290264' // From a valid Twilio number
    })
        .then((message) => console.log(message.sid))
        .then(result => {
            res.status(200).json({
                code:val,
                success: true,
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


function  Sendmail(mail, name, msg) {
    console.log("varrr", mail, name, Sender.Sender, From)
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        // should be replaced with real sender's account
        auth: Sender.Sender
    });

    let mailOptions = {
        // should be replaced with real recipient's account


        from: From.From,
        to: mail,
        subject: 'Account Verification',
        html: '<html><body><div style="width: 50%;margin: auto;padding: 15px;background: #abd12136;"> <div style="width: 120px;margin: auto"> <img width=" " src="https://nappdeal.com/images/logo-main.png" alt="logo" style="width:120px;margin:auto;visibility: visible;opacity: 1;transform-origin: 24% 20% 0px;transform: scaleX(1) scaleY(1);" class=""> </div>Hello <b> '+ name +' </b><br><br> '+ msg +' <b> <br><br> <b> Best regards</b></div></body></html>'
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("mail send")
    });




};



exports.createUser = (req, res, next) => {
//console.log("req-body",req.body)
let msg ="Thank you for applying for an account. Your account is currently pending approval by the site administrator."
    let fetched=[]
    User.find().then(result=>{
        //console.log(result)
        fetched=JSON.stringify(result)
        if(fetched.includes(req.body.email)){
            //console.log("flase1")
            res.status(200).json({
                message: "Email already used !",
                prob:"Email",
                result: result
            });
        }
        else if(fetched.includes(req.body.phoneNumber)){
            //console.log("flase3")
            res.status(200).json({
                message: "Phone number already used !",
                prob:"Phone",
                result: result
            });
        }
        else if(fetched.includes(req.body.email) && fetched.includes(req.body.phoneNumber)){
            //console.log("flase2222")
            res.status(200).json({
                message: "Phone number and email are Both already used !",
                prob:"emailAndPhone",
                result: result
            });

        }
        else {

            bcrypt.hash(req.body.password, 10).then(hash => {
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    phoneNumber: req.body.phoneNumber,
                    profileImage:"https://res.cloudinary.com/pi-dev/image/upload/v1555884886/bjce0bnez3w7oqbykqre.png",
                    balance: 25,
                    role: req.body.role,
                    password: hash,
                    lat: req.body.lat,
                    lng:req.body.lng,


                });
                user
                    .save()
                    .then(user => {

                        const token = jwt.sign(
                            {
                                email: user.email,
                                userId: user._id,
                                username: user.username,
                                role: user.role,
                                profileImage: user.profileImage,
                                balance: user.balance,

                            },
                            "secret_this_should_be_longer",
                            {expiresIn: "1h"}
                        );

                        console.log("ok");
                        Sendmail(user.email,user.name,msg)
                        res.status(201).json({
                            message: "User created!",
                            result: user,
                            token: "Bearer " + token
                        });
                    })
            })

                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        }
    }).catch(handleError(res));








};


exports.signupSocialMedia = (req, res, next) => {
    console.log("bodyy fb",req.body)
    let msg ="Thank you for applying for an account. Your account is currently pending approval by the administrator."
    let fetched=[]
    User.findOne({email: req.body.email}).then(result=>{
        console.log('result',result)
        fetched=JSON.stringify(result)
        if(result){

            const token = jwt.sign(
                {
                    email: result.email,
                    userId: result._id,
                    username: result.username,
                    role: result.role,
                    profileImage: req.body.profileImage,
                },
                "secret_this_should_be_longer",
                {expiresIn: "1h"}
            );

            res.status(200).json({
                message: "User existed",
                result: result,
                token: token
            });
        }

        else {

            bcrypt.hash(req.body.password, 10).then(hash => {
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    profileImage: req.body.profileImage,
                    balance: req.body.balance,
                    phoneNumber:"",
                    role: req.body.role,
                   // password: hash,
                    provider: req.body.provider,
                    providerID: req.body.providerID,
                    lat: req.body.lat,
                    lng:req.body.lng,


                });
                user
                    .save()
                    .then(user => {

                        const token = jwt.sign(
                            {
                                email: user.email,
                                userId: user._id,
                                username: user.username,
                                role: user.role,
                                profileImage: user.profileImage,
                                balance:user.balance
                            },
                            "secret_this_should_be_longer",
                            {expiresIn: "1h"}
                        );

                        Sendmail(user.email,user.name,msg)
                        res.status(201).json({
                            message: "User created!",
                            result: user,
                            token: token
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            })

                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        }
    }).catch(handleError(res));



};

exports.userLogin = (req, res, next) => {
    console.log("connected to server")
    /*const {errors, isValid} = validateLoginInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }*/
    console.log(req.body)

    let fetchedUser;
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            if(fetchedUser.role==="Admin"){
                console.log("admin token")
                const token = jwt.sign(
                    {   uuid:"XgbuVEXBU5gtSKdbQRP1Zbbby1i1",
                        email: fetchedUser.email,
                        userId: fetchedUser._id,
                        username: fetchedUser.username,
                        role: fetchedUser.role,
                        profileImage: fetchedUser.profileImage,

                    },

                    "secret_this_should_be_longer",
                    {expiresIn: "1h"}
                );
                res.status(200).json({
                    success: true,
                    access_token:token,
                    user:fetchedUser
                });
            }
            else
            {
                const token = jwt.sign(
                    {
                        email: fetchedUser.email,
                        userId: fetchedUser._id,
                        username: fetchedUser.username,
                        role: fetchedUser.role,
                        profileImage: fetchedUser.profileImage,
                        balance: fetchedUser.balance,

                    },
                    "secret_this_should_be_longer",
                    {expiresIn: "1h"}
                );
                res.status(200).json({
                    success: true,
                    access_token:token,
                    user:fetchedUser
                });

            }

        })
        .catch(err => {
            console.log(err);
            return res.status(401).json({
                message: "Invalid authentication credentials!",
                error:err
            });
        });
};


exports.getUsers = ( req, res, next) =>{
//5d399f3c88a6eb03da1d642e id admin dashboard
    return User.find({_id: {$ne: "5d399f3c88a6eb03da1d642e"}}).sort({_id:-1})
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
};

exports.UpdatePassword = ( req, res, next) =>{
    return  bcrypt.hash(req.body.password, 10).then(hash => {
               User.updateOne({email:req.body.email},   { $set: { "password": hash } }).exec()
                 .then(entity =>{

                        res.status(200).json({
                            success: true,

                        });


            })
            .catch(handleError(res));

}).catch(handleError(res));
};


exports.getUser = ( req, res, next) =>{
    var id = req.body.id;

    return User.findById(id)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
};



exports.UpdatePohne = ( req, res, next) =>{
    return User.updateOne({_id:req.body.id},   { $set: { "phoneNumber": req.body.phone } }).exec()
        .then(entity =>{
            var id = req.body.id;
            User.findOne({_id: req.body.id})
                .then(result=>{
                   // console.log("resultresultresult",result)
                    res.status(200).json({
                        success: true,
                        //access_token:token,
                        user:result
                    });
                })

                .catch(err => {
                console.log(err);
                return res.status(401).json({
                    message: "Invalid authentication credentials!",
                    error:err
                });
            });

        })
        .catch(handleError(res));
};


exports.UpdateUser = (req, res, next) => {
    let fetched=[]
            User.find({_id: {$ne: req.body._id}}).sort({_id:-1}).then(result=>{
                //console.log(result)
                    fetched=JSON.stringify(result)
                    if(fetched.includes(req.body.email)){
                        //console.log("flase1")
                        res.status(200).json({
                            message: "Email already used !",
                            prob:"Email",
                            result: result
                        });
                    }
                    else if(fetched.includes(req.body.phoneNumber)){
                        //console.log("flase3")
                        res.status(200).json({
                            message: "Phone number already used !",
                            prob:"Phone",
                            result: result
                        });
                    }
                    else if(fetched.includes(req.body.email) && fetched.includes(req.body.phoneNumber)){
                        //console.log("flase2222")
                        res.status(200).json({
                            message: "Phone number and email are Both already used !",
                            prob:"emailAndPhone",
                            result: result
                        });

                    }

                    else {
            //console.log("false3")
                        return User.updateOne({_id: req.body._id}, {$set: {email: req.body.email, name:req.body.name, phoneNumber:req.body.phoneNumber, balance:req.body.balance}}).exec()

                            .then(handleEntityNotFound(res))
                            .then(respondWithResult(res))
                            .catch(handleError(res));
                    }
            }).catch(handleError(res));







};

exports.activeUser = (req, res, next) => {
    let msg ="Your account has been activated successfully"
    return User.updateOne({_id:req.body._id},   { $set: { "active": true } }).exec()

        .then(entity =>{
           // Sendmail(req.body.email,req.body.name,msg)

            User.find({_id: {$ne: "5d399f3c88a6eb03da1d642e"}}).sort({_id:-1})
                .exec()
                .then(respondWithResult(res))
        })
        .catch(handleError(res));

};

exports.disactiveUser = (req, res, next) => {
    return User.updateOne({_id: req.params.id},{ $set: { "active": false } }).exec()

        .then(entity =>{

            User.find({_id: {$ne: "5d399f3c88a6eb03da1d642e"}}).sort({_id:-1})
                .exec()
                .then(respondWithResult(res))
        })
        .catch(handleError(res));

};


exports.deleteUserById = (req, res, next) => {

    return User.findById(req.params.id).exec()
        .then(entity => {

            entity.remove()
                .then(entity =>{

                    User.find({id: {$ne: req.params.id}}).sort({_id:-1})
                        .exec()
                        .then(respondWithResult(res))
                })
                .catch(handleError(res));
        })



};


// Recharges by user id

exports.deleteRechargeById = (req, res, next) => {

    return Recharge.findById(req.body._id).exec()
        .then(entity => {

            entity.remove()
                .then(entity =>{

                    let myrecharges =[];

                    console.log(req.body)
                    User.findById(req.body.user._id).then( user => {
                        if(user){
                            // console.log(user)

                            Recharge.find().then( recharges => {
                                if(recharges){
                                    console.log(recharges)
                                    recharges.map(e => {

                                        if(e.user.id === user.id ){
                                            console.log(e)
                                            myrecharges.push(e)

                                        }
                                    })
                                    res.status(200).json({
                                        message: "My Rechargs !!!! ",
                                        result: myrecharges ,
                                    });

                                }
                            })
                        }
                    }).catch(handleError(res));
                })
                .catch(handleError(res));
        })



};

exports.RechargesByUserId = (req, res, next) => {
    let myrecharges =[];

    User.findById(req.body.id).then( user => {
        if(user){
          //  console.log(user)

            Recharge.find().then( recharges => {
                if(recharges){
                  //  console.log(recharges)
                    recharges.map(e => {

                        if(e.user.id === user.id ){
                            console.log(e)
                            myrecharges.push(e)

                        }
                    })
                    res.status(200).json({
                        message: "My Recharge !!!! ",
                        result: myrecharges ,
                    });

                }
            })
        }
    }).catch(handleError(res));




};

//  transactions by user id


exports.deleteTransactionById = (req, res, next) => {

    return Transaction.findById(req.body._id).exec()
        .then(entity => {

            entity.remove()
                .then(entity =>{

                    let mytransactions =[];

                    console.log(req.body)
                    User.findById(req.body.user._id).then( user => {
                        if(user){
                            // console.log(user)

                            Transaction.find().then( transactions => {
                                if(transactions){
                                    console.log(transactions)
                                    transactions.map(e => {

                                        if(e.user.id === user.id ){
                                            console.log(e)
                                            mytransactions.push(e)

                                        }
                                    })
                                    res.status(200).json({
                                        message: "My Transaction !!!! ",
                                        result: mytransactions ,
                                    });

                                }
                            })
                        }
                    }).catch(handleError(res));
                })
                .catch(handleError(res));
        })



};


exports.UndoarchiveTransaction=(req,res,next)=>{
    console.log("unarchive")
    Transaction.findById(req.body._id).then(transaction=>{
        if(transaction){
            transaction.archived=false;
            transaction.save()
                .then(x=>{

                    let mytransactions =[];

                    console.log(req.body)
                    User.findById(req.body.user._id).then( user => {
                        if(user){
                            // console.log(user)

                            Transaction.find().then( transactions => {
                                if(transactions){
                                    console.log(transactions)
                                    transactions.map(e => {

                                        if(e.user.id === user.id ){
                                            console.log(e)
                                            mytransactions.push(e)

                                        }
                                    })
                                    res.status(200).json({
                                        message: "My Transaction !!!! ",
                                        result: mytransactions ,
                                    });

                                }
                            })
                        }
                    }).catch(handleError(res));

                })

        }
        else {
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
};

exports.archiveTransaction=(req,res,next)=>{
    console.clear()
    console.log("archive tr")
    Transaction.findById(req.body._id).then(transaction=>{
        if(transaction){
            transaction.archived=true;
            transaction.save()
                .then(x=>{

                    let mytransactions =[];

                    console.log(req.body)
                    User.findById(req.body.user._id).then( user => {
                        if(user){
                            // console.log(user)

                            Transaction.find().then( transactions => {
                                if(transactions){
                                    console.log(transactions)
                                    transactions.map(e => {

                                        if(e.user.id === user.id ){
                                            console.log(e)
                                            mytransactions.push(e)

                                        }
                                    })
                                    res.status(200).json({
                                        message: "My Transaction !!!! ",
                                        result: mytransactions ,
                                    });

                                }
                            })
                        }
                    }).catch(handleError(res));


                })

        }
        else {
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
};


exports.TransactionsByUserIdTest = (req, res, next) => {
    let mytransactions =[];

    User.findById(req.body.id).then( user => {
        if(user){
            //  console.log(user)

            Transaction.find().sort({_id:-1}).then( transactions => {
                if(transactions){
                    //  console.log(recharges)
                    transactions.map(e => {

                        if(e.user.id === user.id ){
                            console.log(e)
                            mytransactions.push(e)

                        }
                    })
                    res.status(200).json({
                        message: "My Transaction !!!! ",
                        result: mytransactions ,
                    });

                }
            })
        }
    }).catch(handleError(res));

};


exports.TransactionsByUserId = (req, res, next) => {
    let mytransactions =[];

    User.findById(req.body.id).then( user => {
        if(user){
            //  console.log(user)

            Transaction.find().sort({_id:-1}).then( transactions => {
                if(transactions){
                    //  console.log(recharges)
                    transactions.map(e => {

                        if(e.user.id === user.id ){
                            console.log(e)
                            mytransactions.push(e)

                        }
                    })
                    res.status(200).json({
                        message: "My Transaction !!!! ",
                        result: mytransactions ,
                    });

                }
            })
        }
    }).catch(handleError(res));

};


//  claim by user id

exports.deleteClaimById = (req, res, next) => {

    return Claim.findById(req.body._id).exec()
        .then(entity => {

            entity.remove()
                .then(entity =>{

                    let myclaims =[];

                    console.log(req.body)
                    User.findById(req.body.user._id).then( user => {
                        if(user){
                            // console.log(user)

                            Claim.find().then( claims => {
                                if(claims){
                                    console.log(claims)
                                    claims.map(e => {

                                        if(e.user.id === user.id ){
                                            console.log(e)
                                            myclaims.push(e)

                                        }
                                    })
                                    res.status(200).json({
                                        message: "My Claims !!!! ",
                                        result: myclaims ,
                                    });

                                }
                            })
                        }
                    }).catch(handleError(res));
                })
                .catch(handleError(res));
        })



};

exports.ClaimsByUserId = (req, res, next) => {
    let myclaims =[];

    User.findById(req.body.id).then( user => {
        if(user){
            //  console.log(user)

            Claim.find().then( claims => {
                if(claims){
                  //  console.log(claims)
                    claims.map(e => {

                        if(e.user.id === user.id ){
                            console.log(e)
                            myclaims.push(e)

                        }
                    })
                    res.status(200).json({
                        message: "My Claims !!!! ",
                        result: myclaims ,
                    });

                }
            })
        }
    }).catch(handleError(res));




};

exports.makeid= (length) =>{
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


exports.mailing = (req, res, next) => {
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            // should be replaced with real sender's account
            user: 'carsnappdeal@gmail.com',
            pass: 'azertysoft'
        }
    });

    User.find({email :req.body.email}).then( user => {
    var code = this.makeid(6);

        if(user){
            let mailOptions = {
                // should be replaced with real recipient's account


                from: 'nappdeal@gmail.com',
                to: req.body.email,
                subject: 'Reset password',
                html: '<html><body><div style="width: 50%;margin: auto;padding: 15px;background: #abd12136;"> <div style="width: 120px;margin: auto"> <img width=" " src="https://nappdeal.com/images/logo-main.png" alt="logo" style="width:120px;margin:auto;visibility: visible;opacity: 1;transform-origin: 24% 20% 0px;transform: scaleX(1) scaleY(1);" class=""> </div>Hello <b> '+ user[0].name +' </b><br><br> Use this code <b>'+ code +'</b> to resert your password <br><br> <b> Best regards</b></div></body></html>'
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                res.status(200).json({
                    message: code,

                });
            });
        }


 }).catch(handleError(res));
};


exports.TransfertMoney = (req, res, next) => {

    const bal = Number(req.body.amount)


    User.find({phoneNumber: req.body.to}).then( receiver => {
        if(receiver){

            receiver[0].balance += bal;
            User.updateOne({phoneNumber: req.body.to},   { $set: { "balance": receiver[0].balance } }).exec()


        }
        User.find({phoneNumber: req.body.from}).then(sender =>{

            sender[0].balance -= bal;
            User.updateOne({phoneNumber: req.body.from},   { $set: { "balance": sender[0].balance } }).exec().then(entity => {
               if(entity){
                   res.status(200).json({
                       message: "Money transfered successfully !! ",
                       result: sender
                   });
               }

                const transaction= new Transaction({
                    type:'Transfert',
                    amount: bal,
                    attachement: "attachement",
                    created_at: new Date(),
                    status: "completed",
                    user: sender[0],
                    from :  sender[0],
                    to:    receiver[0],
                    archived:false
                });
                transaction
                    .save()
                    .then(transaction=> {
                        //console.log("ok");
                        res.status(200).json({
                            message: "Transaction created successfully!",
                            result: transaction
                        });
                    })

            })
        })

    })

};
