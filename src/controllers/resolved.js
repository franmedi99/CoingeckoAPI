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