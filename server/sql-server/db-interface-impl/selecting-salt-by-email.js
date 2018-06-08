// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for selecting salt with email passed

var queries = require('./queries');
var updateToken = require('./token-updating-submodule');

const RESULT = 0;

var callbackQuery = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which gets password salt failed!\n");
            console.log(error);
        }
        else {
            if (!!rows.length) {
                info.id = rows[RESULT].id;
                updateToken(info.connection, info.id);
                if (info.callback) info.callback("Success", rows[RESULT].password_salt);
            }
            else if (info.callback) info.callback("UserNotRegistered", null);
        }
}}

var getSaltByEmailQuery = function(connection, email, callback) {

    info = {
        connection : connection,
        email : email,
        callback : callback
    }
    info.connection.query(queries.checkIfEmailExists, [info.email], callbackQuery(info));
}

module.exports = getSaltByEmailQuery;
