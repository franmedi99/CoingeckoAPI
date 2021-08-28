const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const pool = require('../database/conexion');
const helpers = require('../helpers/bcrypt');


const cookieExtractor = req =>{
    let token = null;
    if(req && req.cookies){
        token = req.cookies["access_token"];
    }
    return token;
}

// authenticated local strategy using username and password
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) =>{
//confirm match
const Rows = await pool.query('SELECT * FROM users WHERE username = ?', [username])


if(Rows.length===0){
    const Message = "User not found"
    return done(null,false,Message);
}else{
    const user = Rows[0];
    const NameOfUser = user.name +" "+user.surname; 
    const PasswordDatabase = user.password
    const ValidPassword = await helpers.matchPassword(password,PasswordDatabase);
    let Message = ""
    if(ValidPassword){
        console.log("valid password")
        Message = "Welcome "+NameOfUser
        return done(null,user,Message)
    }else{
        console.log("invalid password")
        Message = "Incorrect password"
        done(null, false,Message);
    }
}

}));



// authorization 
passport.use(new JwtStrategy({
     jwtFromRequest : cookieExtractor,
     secretOrKey : "franmedi99"
 },(payload,done)=>{
    pool.query('SELECT * FROM users WHERE id_user = ?', [payload.sub],(err,user)=>{
         if(err)
             return done(err,false);
         if(user)
             return done(null,user);
         else
             return done(null,false);
     });
 }));
 