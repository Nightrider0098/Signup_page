const express = require("express");
const app = express();
const path = require("path");
const cookie_parser = require("cookie-parser");
const connection = require("./mysql-connector.js")

const session = require('express-session');
const bodyParser = require("body-parser");
// const passport = require('./passport.js');

const passport = require('passport');
const port = process.env.PORT || 5400;
app.use(express.static(path.join(__dirname, "\\Public\\")));
app.set('view engine', 'ejs');
app.use(express.urlencoded({  extended: true, type: "application/x-www-form-urlencoded"}));
app.use(cookie_parser());
app.use(bodyParser.json());


var MySQLStore = require('express-mysql-session')(session);
var options = {
  host: 'localhost',
  port: 3306,
  user: 'user',
  password: '1234',
  database: 'InFuse'
};

var sessionStore = new MySQLStore(options);

app.use(session({
  key: 'session_cookie_name',
  secret: 'session_cookie_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

//middleware to be used for passport 
app.use(passport.initialize());
app.use(passport.session());

//function containing login query
require("./passport")(passport);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.user[0].username, " has requested ");
    return next();
  } else
    res.redirect("/login");
};

app.post("/authenticate/", passport.authenticate('local', {
  failureRedirect: '/login'
}), function (req, res) {
  res.send("ok");
}
);

app.post("/newUser", (req, res) => {
  var credentials = req.body;
  connection.query('select * from user where name like "%' + req.body.username + '%";', (err, result) => {

    if (err) { console.log(err); }
    else {
      if (result[0] != undefined) {
        res.send("user already exists!!!!!!");
        console.log("user already exsits");
      }
      else {
        connection.query("insert into user(name,email,password) values('" + credentials.username + "','" + credentials.email + "','" + credentials.password + "')", (err, response) => {
          if (err) { res.send("can't create account now!!!!"); }
          else {
            res.send("account created!!!!!");
            console.log("account created!!!!")
          }
        })
      }
    }
  });
});

app.get("/home",checkAuthenticated,(req,res)=>{
res.sendfile("./View/home.html");
})


app.get("/login/",(req,res)=>{
  res.sendfile("./View/Login.html");
})


app.get("/logout/",(req,res)=>{
  // res.sendfile("./View/Login.html");
  req.logout();
  res.send("ok");
})


app.get("/", (req, res) => {
  // console.log(  )
  res.set("Set-Cookie", "SameSite=Strict");
  res.set("Set-Cookie", "Secure=true");
  res.sendFile("C:\\Users\\Admin\\Desktop\\Project\\InFuse\\View\\Signup.html");
})


app.listen(port, () => {
  console.log(`listining on port ${port}`);
});

