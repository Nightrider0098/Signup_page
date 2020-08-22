var mysql = require('mysql');


var con = mysql.createConnection({
  host: "localhost",
  user: "user",
  password: "1234",
  database: "InFuse",
  multipleStatements: true
});


con.connect(function(err) {
    if (err) return   console.log("failed to connect to book_store pls download mysql",err);
    else return console.log("connection establish with InFuse DataBase!!!!");
});

module.exports = con;

    