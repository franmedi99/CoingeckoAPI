const CryptoController = {};
const pool = require('../database/conexion');
const axios = require('axios');

CryptoController.setcoinpreference = async (req, res) => {
     const { coinpreference } = req.body;
     const { id_user } = req.user[0];
     if (coinpreference == null)
          res.status(401).json({ message: "Please complete field!!" });
     else {
          if (coinpreference === "usd" || coinpreference === "ars" || coinpreference === "eur") {
               await pool.query('UPDATE users set coinpreference = ? WHERE id_user = ?', [coinpreference, id_user]);
               res.status(200).json({ message: "Currency preference successfully updated to " + coinpreference });
          } else {
               res.status(401).json({ message: "The currency preference can only be ars,eur or usd!!" });
          }
     }

}

CryptoController.list = async (req, res) => {
     const { coinpreference } = req.user[0];
     var { page } = req.body
     if (coinpreference == null || page == null)
          res.status(401).json({ message: "first choose a currency preference and send a page!!" });
     else {
          var object = []
          const { data } = await axios('https://api.coingecko.com/api/v3/coins/markets?vs_currency=' + coinpreference + '&order=market_cap_desc&per_page=100&page=' + page + '&sparkline=false')
          data.forEach(element => {
               object.push({ "id": element.id, "name": element.name, "symbol": element.symbol, "price": element.current_price, "image": element.image, "last_updated": element.last_updated })
          });
          res.status(200).json(object);
     }

}


CryptoController.top = async (req, res) => {
     const { id_user } = req.user[0]
     const { order } = req.body
     if (order === "desc" || order === "asc" || order === "DESC" || order === "ASC") {
          const Result = await pool.query('SELECT coins.name,coins.symbol,coins.price_ars,coins.price_usd,coins.price_eur,coins.image,coins.last_updated FROM coins INNER JOIN users_coins ON  users_coins.id_coin = coins.id_coin wHERE users_coins.id_user = ? ORDER BY coins.price_usd  ' + order + '', [id_user]);
          res.status(201).json(Result);
     }
     else {
          res.status(401).json({ message: "the order can only be asc or desc" });
     }

}


CryptoController.newcrypto = async (req, res) => {
     const { cryptoID } = req.body;
     const user = req.user[0]
     if (cryptoID == null)
          res.status(401).json({ message: "Please send an ID Coin" });
     else {
          const UserTop = await pool.query('SELECT * FROM users_coins WHERE id_user = ?', [user.id_user]);
          if (UserTop.length >= 26) {
               res.status(400).json({ message: "the limit of cryptocurrencies per user is 25" });
          } else {
               var ObjectAPI = await axios('https://api.coingecko.com/api/v3/coins/' + cryptoID, { validateStatus: false })
               var ObjectAPI = ObjectAPI.data
               if (ObjectAPI.error)
                    res.status(404).json({ message: "Please send a valid ID coin" });
               else {
                    const price = ObjectAPI.market_data.current_price
                    const NewCoin = { "id_namecoin": ObjectAPI.id, "name": ObjectAPI.name, "symbol": ObjectAPI.symbol, "price_ars": price.ars, "price_usd": price.usd, "price_eur": price.eur, "image": ObjectAPI.image.large, "last_updated": ObjectAPI.last_updated }
                    const VerifyResult = await pool.query('SELECT * FROM coins WHERE id_namecoin = ?', [cryptoID]);
                    if (VerifyResult.length >= 1) {
                         const VerifyTopCoin = await pool.query('SELECT * FROM users_coins WHERE id_user = ? AND id_coin = ?', [user.id_user, VerifyResult[0].id_coin]);
                         if (VerifyTopCoin.length >= 1)
                              res.status(401).json({ message: "This coin is already at its top" });
                         else {
                              pool.query('UPDATE coins set ? WHERE id_coin = ?', [NewCoin, VerifyResult[0].id_coin]);
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






module.exports = CryptoController;