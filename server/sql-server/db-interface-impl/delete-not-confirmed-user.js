// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for deleting user if email is failed to be sent

var queries = require('./queries');
var updateToken = require('./token-updating-submodule');

const RESULT = 0;

var bannCheckCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which deletes data failed!\n");
        console.log(error);
    }
    else if (info.callback) info.callback("Success");
}}

var emailCheckCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which search for username failed!\n");
        console.log(error);
    }
    else {
        if (!!rows.length) {
            info.id = rows[RESULT].id;
            info.connection.query(queries.deleteNotConfirmedUser, [info.id], bannCheckCallback(info));
        }
        else if (info.callback) info.callback("UserNotExists");
    }
}}

var changePasswordQuery = function(connection, email, callback) {

    info = {
        connection: connection,
        email: email,
        callback: callback
    }

    info.connection.query(queries.checkIfEmailExists, [info.email], emailCheckCallback(info));
}

module.exports = changePasswordQuery;
