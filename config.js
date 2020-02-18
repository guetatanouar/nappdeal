 const facebook = {
  clientID: '389239685037144',
  clientSecret: 'f3a54b913a5cf0fccced9315ad547a6c',
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'name', 'displayName', 'picture', 'email'],
}

 const google = {
  clientID: 'PASTE_CLIENT_ID_HERE',
  clientSecret: 'PASTE_CLIENT_SECRET_HERE',
  callbackURL: 'http://localhost:3000/auth/google/callback',
}
 const Sender ={
    // should be replaced with real sender's account
    user: 'carsnappdeal@gmail.com',
    pass: 'azertysoft'
}
// should be replaced with real recipient's account
 const From =  'nappdeal@gmail.com';




module.exports = {Sender, From};