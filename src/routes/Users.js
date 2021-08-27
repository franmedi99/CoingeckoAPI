const express = require('express');
const router = express.Router();
const pool = require('../database/conexion');

const signToken = userID =>{
     return JWT.sign({
         iss : "franmedi99",
         sub : userID
     },"NoobCoder",{expiresIn : "3h"});
 }

router.post('/register',(req,res)=>{
    
     const {name,surname,email,password,repassword} = req.body;
     const role ="user";
     if(name===""||surname===""||email===""||password===""||repassword===""){
         res.status(400).json({message : {msgBody : "Por favor Complete Todos los campos", msgError: true}});
     }
     else if(password!=repassword){
         res.status(400).json({message : {msgBody : "Las Contraseñas no coinciden", msgError: true}});
     }else{
     User.findOne({email},(err,verified)=>{
         if(err){
             res.status(500).json({message : {msgBody : "Ha ocurrido un error inesperado", msgError: true}});
         }
         if(verified)
             res.status(400).json({message : {msgBody : "Este email ya esta registrado", msgError: true}});
         else{
 
             const newUser = new User({name,surname,email,password,role});
             newUser.save(err=>{
                 if(err){
                
                     res.status(500).json({message : {msgBody : "Ha ocurrido un error inesperado", msgError: true}});
                 } else
                     res.status(201).json({message : {msgBody : "Cuenta creada satisfactoriamente", msgError: false}});
             });
         }
     });
 }
 });



 module.exports = router;