const CryptoController = {};
//obteniendo base de datos
const pool = require('../database/conexion');

//Inicializando y definiendo coingecko
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

//actualiza la preferencia de moneda de un usuario
CryptoController.setcoinpreference = async (req, res) => {
     const { coinpreference } = req.body;
     const { id_user } = req.user[0];
     if (coinpreference == null || coinpreference === "")
          res.status(400).json({ message: "Please complete field!!" });
     else {
          if (coinpreference === "usd" || coinpreference === "ars" || coinpreference === "eur") {
               await pool.query('UPDATE users set coinpreference = ? WHERE id_user = ?', [coinpreference, id_user]);
               res.status(200).json({ message: "Currency preference successfully updated to " + coinpreference });
          } else {
               res.status(400).json({ message: 'The currency preference can only be "ars","eur" or "usd"!!' });
          }
     }

}

//obtiene una lista con las primeras 100 criptomonedas
CryptoController.list = async (req, res) => {

     const { coinpreference } = req.user[0];
     var { page } = req.body
     if (coinpreference == null || coinpreference === "" || page == null || page === "")
          res.status(400).json({ message: "first choose a currency preference and send a page!!" });
     else {
          var object = []
          const { data } = await CoinGeckoClient.coins.markets({ vs_currency: coinpreference, page })
          data.forEach(element => {
               object.push({ "id": element.id, "name": element.name, "symbol": element.symbol, "price": element.current_price, "image": element.image, "last_updated": element.last_updated })
          });
          res.status(200).json(object);
     }

}
/*
//obtiene el top personal de cada usuario
CryptoController.top = async (req, res) => {
     const { id_user } = req.user[0]
     let object = []
     var { order } = req.body
     var order = order || "desc"
     if (order === "desc" || order === "asc" || order === "DESC" || order === "ASC") {
          const Result = await pool.query('SELECT coins.id_coin, coins.id_namecoin FROM coins INNER JOIN users_coins ON  users_coins.id_coin = coins.id_coin WHERE users_coins.id_user = ?', [id_user]);
          if (Result.length === 0)
               return res.status(200).json([])

          Result.forEach(async (element) => {

               const { data } = await CoinGeckoClient.coins.fetch(element.id_namecoin, {})
               object.push({ "id_coin": element.id_coin, "id": data.id, "name": data.name, "symbol": data.symbol, "image": data.image.large, "last_updated": data.last_updated, "usd": data.market_data.current_price.usd, "ars": data.market_data.current_price.ars, "eur": data.market_data.current_price.eur })

               if (object.length === Result.length) {
                    if (order === "desc" || order === "DESC") {
                         object.sort((a, b) => {
                              if (a.usd > b.usd) { return -1 }
                              if (a.usd < b.usd) { return 1 }
                              return 0
                         })
                    } else {
                         object.sort((a, b) => {
                              if (a.usd < b.usd) { return -1 }
                              if (a.usd > b.usd) { return 1 }
                              return 0
                         })
                    }

                    res.status(200).json(object)
               }

          });
          
     } else {
          res.status(400).json({ message: "the order can only be asc or desc" });
     }

}
*/

CryptoController.top = async (req, res) => {
     const { id_user } = req.user[0]
     let object = []
     let promises = []
     var { order } = req.body
     var order = order || "desc"
     if (order === "desc" || order === "asc" || order === "DESC" || order === "ASC") {
          const Result = await pool.query('SELECT coins.id_coin, coins.id_namecoin FROM coins INNER JOIN users_coins ON  users_coins.id_coin = coins.id_coin WHERE users_coins.id_user = ?', [id_user]);
          if (Result.length === 0)
               return res.status(200).json([])

          Result.forEach(element => {
               try {
                    if(element.id_coin===3) throw new Error('??Ups error!')
                    promises.push(CoinGeckoClient.coins.fetch(element.id_namecoin, {}).then(res => {
                         object.push({ "id_coin": element.id_coin, "id": res.data.id, "name": res.data.name, "symbol": res.data.symbol, "image": res.data.image.large, "last_updated": res.data.last_updated, "usd": res.data.market_data.current_price.usd, "ars": res.data.market_data.current_price.ars, "eur": res.data.market_data.current_price.eur })
                    }))
               } catch (error) {
                    console.log(error)
               }

          })

          await Promise.all(promises)

          if (order === "desc" || order === "DESC") {
               object.sort((prev, next) => {
                    if (prev.usd > next.usd) { return -1 }
                    if (prev.usd < next.usd) { return 1 }
                    return 0
               })
          } else {
               object.sort((prev, next) => {
                    if (prev.usd < next.usd) { return -1 }
                    if (prev.usd > next.usd) { return 1 }
                    return 0
               })
          }


      res.status(200).json(object) 
     } else {
          res.status(400).json({ message: "the order can only be asc or desc" });
     }

}

























//agrega una nueva criptomoneda a la base de datos y al usuario
CryptoController.newcrypto = async (req, res) => {
     const { cryptoID } = req.body;
     const user = req.user[0]
     if (cryptoID == null || cryptoID === "")
          res.status(400).json({ message: "Please send an ID Coin" });
     else {
          const UserTop = await pool.query('SELECT * FROM users_coins WHERE id_user = ?', [user.id_user]);
          if (UserTop.length >= 26) {
               res.status(400).json({ message: "the limit of cryptocurrencies per user is 25" });
          } else {
               var ObjectAPI = await CoinGeckoClient.coins.fetch(cryptoID, {});
               var ObjectAPI = ObjectAPI.data
               if (ObjectAPI.error)
                    res.status(400).json({ message: "Please send a valid ID coin" });
               else {
                    const NewCoin = { "id_namecoin": ObjectAPI.id }
                    const VerifyResult = await pool.query('SELECT * FROM coins WHERE id_namecoin = ?', [cryptoID]);
                    if (VerifyResult.length >= 1) {
                         const VerifyTopCoin = await pool.query('SELECT * FROM users_coins WHERE id_user = ? AND id_coin = ?', [user.id_user, VerifyResult[0].id_coin]);
                         if (VerifyTopCoin.length >= 1)
                              res.status(400).json({ message: "This coin is already at its top" });
                         else {
                              const UserCoin = { "id_coin": VerifyResult[0].id_coin, "id_user": user.id_user }
                              pool.query('INSERT into users_coins SET ?', UserCoin);
                              res.status(200).json({ message: "Cryptocurrency added successfully" });
                         }
                    } else {
                         await pool.query('INSERT into coins SET ?', NewCoin);
                         const Object = await pool.query('SELECT * FROM coins WHERE id_namecoin = ?', [cryptoID]);
                         const UserCoin = { "id_coin": Object[0].id_coin, "id_user": user.id_user }
                         await pool.query('INSERT into users_coins SET ?', UserCoin);
                         res.status(200).json({ message: "Cryptocurrency added successfully" });
                    }
               }
          }
     }

}

//elimina una criptomoneda de un usuario
CryptoController.deleteoftop = async (req, res) => {
     let { id_coin } = req.params;
     const { id_user } = req.user[0];
     const Result = await pool.query('SELECT * FROM users_coins WHERE id_user = ? AND id_coin = ?', [id_user, id_coin]);
     if (Result.length === 0)
          return res.status(400).json({ message: "Unauthorized" });

     await pool.query('DELETE FROM users_coins WHERE id_user = ? AND id_coin = ?', [id_user, id_coin]);
     res.status(200).json({ message: "cryptocurrency successfully deleted" });
}





module.exports = CryptoController;