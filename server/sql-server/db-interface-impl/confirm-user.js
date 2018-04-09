// Owner: Filip Mandic (mandula8)

// Summary: Functions and callbacks for confirming user

var queries = require('./queries');

var deleteFromUserNotConfirmedCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which deletes user from not confirmed table failed!\n");
        throw error;
    }
    else if (info.callback) info.callback("Success", info.username);
}}

var getConfirmCodeCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which gets confirm code failed!\n");
        throw error;
    }
    else {
        if (rows[0].confirm_code === info.confirmationCode) {
            info.connection.query(queries.deleteFromUserNotConfirmed, [info.id],
                deleteFromUserNotConfirmedCallback(info));
        }
        else if (info.callback) info.callback("InvalidConfirmationCode", info.username);
    }
}}

var userIsNotConfirmedCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which check if user is not confirmed failed!\n");
        throw error;
    }
    else {
        if (!!rows.length) {
            info.connection.query(queries.getConfirmCode, [info.id], getConfirmCodeCallback(info));
        }
        else if (info.callback) info.callback("UserAlreadyConfirmed", info.username);
    }
}}

var usernameCheckCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which search for username failed!\n");
        throw error;
    }
    else {
        if (!!rows.length) {
            info.id = rows[0].id;
            info.connection.query(queries.checkIsNotConfirm, [info.id], userIsNotConfirmedCallback(info));
        }
        else if (info.callback) info.callback("UserNotRegistered", info.username);
    }
}}

//sredjeno na dole

var confirmUser = function(connection, username, confirmationCode, callback) {

    info = {
        connection: connection,
        username: username,
        confirmationCode: confirmationCode,
        callback: callback
    }

    info.connection.query(queries.checkIfUsernameExists, [info.username], usernameCheckCallback(info));
}

module.exports = confirmUser;

//"SELECT * FROM user_not_confirmed WHERE id_not_confirmed = " + parseInt(info.id), userIsNotConfirmedCallback(info)