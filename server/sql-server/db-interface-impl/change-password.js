// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for changing password

var queries = require('./queries');
var updateToken = require('./token-updating-submodule');
const RESULT = 0;

var changePasswordCall = function(info) { return function(error, rows, fields) {
    if (!!error) {
        info.connection.rollback(function() {
            console.log("error: query that inserts new hash and salt failed!\n");
            console.log(error);
        });
    }
    else {
        info.connection.commit(function(error) {
            if (!!error) {
                info.connection.rollback(function() {
                    console.log("error: transaction could not be commited, transaction rollback!\n");
                    console.log(error);
                });
            }
            else {
                updateToken(info.connection, info.id);
                if (info.callback) info.callback("Success");
            }
        });
    }
}}

var usernameCheckCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which search for username failed!\n");
        console.log(error);
    }
    else {
        if (!!rows.length) {
            if (rows[RESULT].password_hash === info.oldHash) {
                info.id = rows[RESULT].id;
                info.connection.beginTransaction(function(error) {
                    if (!!error) {
                        console.log("error: transaction failed to be started!\n");
                        console.log(error);
                    }
                    info.connection.query(queries.setNewPasswordAndSalt,
                        [info.newHash, info.newSalt, info.id], changePasswordCall(info));
                });
            }
            else if (info.callback) {
                updateToken(info.connection, info.id);
                info.callback("PasswordNoMatch");
            }
        }
        else if (info.callback) info.callback("UserNotRegistered");
    }
}}

var changePasswordQuery = function(connection, username, oldHash, newHash, newSalt, callback) {
    info = {
        connection: connection,
        username: username,
        oldHash: oldHash,
        newHash: newHash,
        newSalt: newSalt,
        callback: callback
    }

    info.connection.query(queries.searchInUserByUsername, [info.username], usernameCheckCallback(info));
}

module.exports = changePasswordQuery;
