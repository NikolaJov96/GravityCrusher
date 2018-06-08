// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for inserting new token by sending email

var queries = require('./queries');

const RESULT = 0;
const TOKEN_LIFETIME = 14;
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
            var date = new Date();
            date.setDate(date.getDate() + TOKEN_LIFETIME);
            info.connection.beginTransaction(function(error) {
                if (!!error) {
                    console.log("error: transaction failed to be started!\n");
                    console.log(error);
                }
                info.connection.query(queries.insertNewToken,
                    [info.id, info.tokenCode, date], insertTokenCallback(info));
            });
        }
        else if (info.callback) info.callback("UserNotRegistered", false);
    }
}}

var insertTokenByEmail = function(connection, email, tokenCode, callback) {

    info = {
        connection: connection,
        email: email,
        tokenCode: tokenCode,
        callback: callback
    }

    info.connection.query(queries.checkIfEmailExists, [info.email], usernameCheckCallback(info));
}

module.exports = insertTokenByEmail;
