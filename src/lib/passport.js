const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const pool = require('../database/conexion');
const helpers = require('../helpers/bcrypt');


const cookieExtractor = req =>{
    let Token = null;
    if(req && req.cookies){
        Token = req.cookies["access_token"];
    }
    return Token;
}

// authenticated local strategy using username and password
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) =>{
//confirm match
const user = await pool.query('SELECT * FROM users WHERE username = ?', [username])
if(!user){
    const Message = "user not found"
    return done(null,false,Message);
}else{
    helpers.comparePassword(password,done);
}

}));



// authorization 
passport.use(new JwtStrategy({
     jwtFromRequest : cookieExtractor,
     secretOrKey : process.env.JWTPASSWORD || "Default"
 },(payload,done)=>{
     User.findById({_id : payload.sub},(err,user)=>{
         if(err)
             return done(err,false);
         if(user)
             return done(null,user);
         else
             return done(null,false);
     });
 }));
 