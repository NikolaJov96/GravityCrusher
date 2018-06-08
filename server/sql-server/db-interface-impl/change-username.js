// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for changing username

var queries = require('./queries');
var updateToken = require('./token-updating-submodule');

const RESULT = 0;

var changeUsernameCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        info.connection.rollback(function() {
            console.log("error: query which checks inserts new username failed\n");
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
                if (info.callback) {
                    updateToken(info.connection, info.id);
                    info.callback("Success");
                }
            }
        });
    }
}}

var newUsernameCheckCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        info.connection.rollback(function() {
            console.log("error: query which checks if newUsername is used failed!\n");
            console.log(error);
        });
    }
    else {
        if (!rows.length) {
            info.connection.query(queries.setNewUsername,
                [info.newUsername, info.id], changeUsernameCallback(info));
        }
        else if (info.callback) {
            updateToken(info.connection, info.id);
            info.callback("UsernameTaken");
        }
    }
}}

var oldUsernameCheckCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which checks if oldUsername is used failed!\n");
        console.log(error);
    }
    else {
        if (!!rows.length) {
            info.id = rows[RESULT].id;
            info.connection.beginTransaction(function(error) {
                if (!!error) {
                    console.log("error: transaction failed to be started!\n");
                    console.log(error);
                }
                info.connection.query(queries.searchInUserByUsername,
                    [info.newUsername], newUsernameCheckCallback(info));
            });

        }
        else if (info.callback) info.callback("UserNotRegistered");
    }
}}

var changeUsername = function(connection, oldUsername, newUsername, callback) {

    info = {
        connection: connection,
        oldUsername: oldUsername,
        newUsername: newUsername,
        callback: callback
    }

    info.connection.query(queries.searchInUserByUsername, [info.oldUsername], oldUsernameCheckCallback(info));
}

module.exports = changeUsername;
