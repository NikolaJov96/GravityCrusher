// Owner: Filip Mandic (mandula8)

// Summary: Functions and callbacks for verifying registration with email

var queries = require('./queries');
var updateToken = require('./token-updating-submodule');

const RESULT = 0;

var insertIntoStatisticsCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        info.connection.rollback(function() {
            console.log("error: query which insertes user into statistics table failed, transaction rollback!\n");
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

var deleteFromUserNotConfirmedCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        info.connection.rollback(function() {
            console.log("error: query which deletes user from not confirmed table failed, transaction rollback!\n");
            console.log(error);
        });
    }
    else info.connection.query(queries.insertUserInStatistics, [info.id], insertIntoStatisticsCallback(info));
}}

var userCheckCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which searches if user not found failed!\n");
        console.log(error);
    }
    else {
        if (!!rows.length) {
            if (rows[RESULT].confirm_code === info.confirmationCode) {
                info.connection.beginTransaction(function(error) {
                    if (!!error) {
                        console.log("error: transaction failed to be started!\n");
                        console.log(error);
                    }
                    info.connection.query(queries.deleteFromUserNotConfirmed, [info.id],
                        deleteFromUserNotConfirmedCallback(info));
                });
            }
            else if (info.callback) info.callback("UserNotConfirmed");
        }
        else if (info.callback) info.callback("Success");
    }
}}

var usernameCheckCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which search for email failed!\n");
        console.log(error);
    }
    else {
        if (!!rows.length) {
            info.id = rows[RESULT].id;
            info.connection.query(queries.seachInUserNotCnfirmed, [info.id], userCheckCallback(info));
        }
        else if (info.callback) info.callback("UserNotRegistered");
    }
}}

var verifyRegWithEmail = function(connection, email, confirmationCode, callback) {

    info = {
        connection: connection,
        email: email,
        confirmationCode: confirmationCode,
        callback: callback
    }

    info.connection.query(queries.checkIfEmailExists, [info.email], usernameCheckCallback(info));
}

module.exports = verifyRegWithEmail;
