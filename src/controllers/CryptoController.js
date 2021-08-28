const CryptoController = {};
const pool = require('../database/conexion');
const axios = require('axios');

CryptoController.setcoinpreference = async(req,res)=>{

     const {coinpreference} = req.body;
     const {id_user} = req.user;
     if(coinpreference==null)
     res.status(401).json({message : "Please complete field!!"});
     else{
          if(coinpreference==="usd" || coinpreference==="ars" || coinpreference==="eur"){
          await pool.query('UPDATE usuarios set ? WHERE id_user = ?', [coinpreference,id_user]);
          res.status(200).json({message : "the currency preference can only be ars,eur or usd!!"});
          }else{
               res.status(401).json({message : "the currency preference can only be ars,eur or usd!!"});
          }
     }

}

CryptoController.list = async(req, res) => {
     const {coinpreference} = req.user[0];
     var {page} = req.body
     console.log(page)
     console.log(coinpreference)
     if(coinpreference==null || page==null)
     res.status(401).json({message : "first choose all currency preferences!!"});
     else{
     var object = []
     const {data} = await axios('https://api.coingecko.com/api/v3/coins/markets?vs_currency='+coinpreference+'&order=market_cap_desc&per_page=100&page='+page+'&sparkline=false')
   //https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum%2Ccardano&order=market_cap_desc&per_page=100&page=1&sparkline=false' 
     data.forEach(element =>{
          object.push({"name":element.name,"symbol": element.symbol,"price": element.current_price,"image":element.image,"last_updated": element.last_updated})
     });
     res.status(200).json(data);
}

}

module.exports = CryptoController;