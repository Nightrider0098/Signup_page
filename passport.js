
const con = require("./mysql-connector.js");
const LocalStrategy = require('passport-local').Strategy;
module.exports = (passport) => {
    
    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' },
        function (username, password, done) {
            con.query(`SELECT * FROM user where (name ="${username}" and password="${password}") or (email ="${username}" and 	password="${password}")`, (err, result, fields) => {
                if (err) {
                    console.log(err);
                    return done(err);
                }
                if (result.length == 0) {
                    console.log("failed attempt by user", username);
                    return done(null, false, { message: "incorrect password" });
                }
                else {
                    console.log("user ", result[0].name, "loggedin ");
                    return done(null, result);
                }
            });

        }));

    passport.serializeUser((user, done) => { done(null, user[0].name); });
    passport.deserializeUser((id, done) => {
        con.query(`SELECT * FROM user where name ="${id}"`, (err, result, fields) => {
            done(null, result);
        });
    })
};