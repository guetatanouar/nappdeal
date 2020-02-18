var express = require('express');
var passport =require('passport');
const path = require("path");
const cookieParser = require("cookie-parser");
var FacebookStrategy =require ('passport-facebook');
var GoogleStrategy= require('passport-google-oauth20');
//Import Facebook and Google OAuth apps configs
//import {facebook,google} from './config';
var bodyParser = require('body-parser')
var db = require("./Models/Db");
var cors = require("cors");

const userRoutes = require("./routes/user");
const tuteurRoutes = require("./routes/tuteur");
const rechargeRoutes = require("./routes/recharge");
const transactionRoutes = require("./routes/transaction");
const productRoutes = require("./routes/product");
const claimRoutes = require("./routes/claim");
const  variantRoutes = require("./routes/variant");
const  CategoryRoutes = require("./routes/category");
 const  MetaDataRoutes = require("./routes/metadata");
const MessageRoutes = require("./routes/message");

const AnalyticRoutes = require("./routes/analytic");
const NotificationRoutes = require("./routes/notification");
const TestsRoutes = require("./routes/test");


const  MakeRoutes = require("./routes/make");
const  ModelRoutes = require("./routes/model");
 facebook = {
    clientID: '389239685037144',
    clientSecret: 'f3a54b913a5cf0fccced9315ad547a6c',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'name', 'displayName', 'picture', 'email'],
}

google = {
    clientID: 'PASTE_CLIENT_ID_HERE',
    clientSecret: 'PASTE_CLIENT_SECRET_HERE',
    callbackURL: 'http://localhost:3000/auth/google/callback',
}

// Transform Facebook profile because Facebook and Google profile objects look different
// and we want to transform them into user objects that have the same set of attributes
const transformFacebookProfile = (profile) => ({
    name: profile.name,
    avatar: profile.picture.data.url,
});

// Transform Google profile into user object
const transformGoogleProfile = (profile) => ({
    name: profile.displayName,
    avatar: profile.image.url,
});



// Initialize http server
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/product", productRoutes);
app.use("/api/recharge", rechargeRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/claim", claimRoutes);
app.use("/api/tuteur", tuteurRoutes);
app.use("/api/variant", variantRoutes);
app.use("/api/user", userRoutes);
app.use("/api/category", CategoryRoutes);
 app.use("/api/metaData", MetaDataRoutes);
 app.use("/api/make", MakeRoutes);
app.use("/api/model", ModelRoutes);
app.use("/api/message", MessageRoutes);

app.use("/api/test", TestsRoutes);

app.use("/api/analytic", AnalyticRoutes);
app.use("/api/notification", NotificationRoutes);


 // Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json({limit: '100mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));


// Set up Facebook auth routes
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }),
    // Redirect user back to the mobile app using Linking with a custom protocol OAuthLogin

    (req, res) => res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user)));

// Set up Google auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google' }),
    (req, res) => res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user)));

// Launch the server on the port 3000
const server = app.listen(2500, () => {
    const { address, port } = server.address();
    console.log(`Listening at http://${address}:${port}`);
});
