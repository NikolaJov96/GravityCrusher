// Owner: Filip Mandic (mandula8)

// Summary: Functions and callbacks for inserting new token by sending username

var queries = require('./queries');

const RESULT = 0;

var deleteDisabledUserCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        info.connection.rollback(function() {
            console.log("error: query which reactivate user failed!\n");
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
                if (info.callback) info.callback("Success", true);
            }
        });
    }
}}


var checkedIfUserDisabledCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        info.connection.rollback(function() {
            console.log("error: query which inserts new token failed!\n");
            console.log(error);
        });
    }
    else {
        if (!!rows.length) {
            info.connection.query(queries.reactivateUser, [info.id], deleteDisabledUserCallback(info));
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
                    if (info.callback) info.callback("Success", false);
                }
            });
        }
    }
}}

var insertTokenCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        info.connection.rollback(function() {
            console.log("error: query which checks if user was disabled failed!\n");
            console.log(error);
        });
    }
    else {
        info.connection.query(queries.checkIfUserIsDisabled, [info.id], checkedIfUserDisabledCallback(info));
    }
}}

var usernameCheckCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which checks if username exists failed!\n");
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
                info.connection.query(queries.insertNewToken,
                    [info.id, info.tokenCode], insertTokenCallback(info));
            });
        }
        else if (info.callback) info.callback("UserNotRegistered", false);
    }
}}

var insertTokenByUsername = function(connection, username, tokenCode, callback) {

    info = {
        connection: connection,
        username: username,
        tokenCode: tokenCode,
        callback: callback
    }

    info.connection.query(queries.searchInUserByUsername, [info.username], usernameCheckCallback(info));
}

module.exports = insertTokenByUsername;
