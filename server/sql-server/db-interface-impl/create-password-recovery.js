// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for password recovery

var queries = require('./queries');
var updateToken = require('./token-updating-submodule');

const RESULT = 0;

var insertCallback = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query that inserts row failed!\n");
            console.log(error);
        }
        else if (info.callback) {
            updateToken(info.connection, info.id);
            info.callback("Success", info.username);
        }
}}

var deletingCallback = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query that delete old row failed!\n");
            console.log(error);
        }
        else {
            info.connection.query(queries.insertIntoPasswordReset,
                [info.id, info.requestCode], insertCallback(info));
        }
}}

var searchInPasswordRecoveryCallback = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which searches if user exists in password recovery failed!\n");
            console.log(error);
        }
        else {
            if (!!rows.length) {
                info.connection.query(queries.deleteFromPasswordReset, [info.id], deletingCallback(info));
            }
            else {
                info.connection.query(queries.insertIntoPasswordReset,
                    [info.id, info.requestCode], insertCallback(info));
            }
        }
}}

var searchInUserCallback = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which searches for user failed!\n");
            console.log(error);
        }
        else {
            if (!!rows.length) {
                    info.id = rows[RESULT].id;
                    info.username = rows[RESULT].username;
                    info.connection.query(queries.searchInPasswordReset,
                        [info.id], searchInPasswordRecoveryCallback(info));
            }
            else if (info.callback) info.callback("UserNotRegistered", null);
        }
}}

var createPasswordRecovery = function(connection, email, requestCode, callback) {

    info = {
        connection : connection,
        email : email,
        requestCode : requestCode,
        callback : callback
    }
    info.connection.query(queries.checkIfEmailExists, [info.email], searchInUserCallback(info));
}

module.exports = createPasswordRecovery;
