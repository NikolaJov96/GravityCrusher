// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for verification of user while sign up with username

var queries = require('./queries');
var updateToken = require('./token-updating-submodule');

const RESULT = 0;

var bannCheckCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which checks if user is banned failed!\n");
        console.log(error);
    }
    else {
        if (!!rows.length) {
            rows[RESULT].bann_date.setHours(rows[RESULT].bann_date.getHours() + 1);
            rows[RESULT].bann_date.setMinutes(0);
            rows[RESULT].bann_date.setSeconds(0);
            if (info.callback) info.callback("UserBanned",
                    rows[RESULT].bann_date.toLocaleDateString().replace(/T/, ' ').replace(/\..+/, '') + ' ' +
                    rows[RESULT].bann_date.toLocaleTimeString().replace(/T/, ' ').replace(/\..+/, ''));
        }
        else if (info.callback) {
            updateToken(info.connection, info.id);
            info.callback("Success", null);
        }
    }
}}

var usernameCheckCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which search for username failed!\n");
        console.log(error);
    }
    else {
        if (!!rows.length) {
            if (rows[RESULT].password_hash === info.hash) {
                info.id = rows[RESULT].id;
                info.connection.query(queries.checkIfUserIsBanned, [info.id], bannCheckCallback(info));
            }
            else {
                updateToken(info.connection, info.id);
                if (info.callback) info.callback("PasswordNoMatch", null);
            }
        }
        else if (info.callback) info.callback("UserNotRegistered", null);
    }
}}

var changePasswordQuery = function(connection, username, hash, callback) {
    info = {
        connection: connection,
        username: username,
        hash: hash,
        callback: callback
    }

    info.connection.query(queries.searchInUserByUsername, [info.username], usernameCheckCallback(info));
}

module.exports = changePasswordQuery;
