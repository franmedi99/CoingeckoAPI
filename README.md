                                   CoingeckoAPI

     1) Instalar XAMPP de https://www.apachefriends.org/es/index.html
     2) Abrir XAMPP Control panel y inciar apache  y Mysql
     3) Dirigirse a http://localhost/phpmyadmin/ y crear una base de datos llamada coingecko
     4) Importar el archivo coingecko.sql que se encuentra dentro de la carpeta /src/database
     5) En el caso que deseé crear la base de datos con SQL las consultas estan dentro de /src/database/create.txt
     6) instalar todos los paquetes con el comando "npm install"
     7) Crear un archivo en el inicio del proyecto llamado .env y dentro de dicho archivo crear las siguiente variables con los siguientes parametros
     8) DB_HOST=localhost DB_USER=root DB_PASSWORD="" DATABASE=coingecko JWTPASSWORD=franmedi99
     9) Iniciar servidor con el comando "npm run dev"