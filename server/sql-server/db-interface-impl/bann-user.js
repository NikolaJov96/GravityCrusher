// Owner: Filip Mandic 2015/0308 (mandula8)

/**
* Summary: Functions and callbacks used to ban user
*/

var queries = require('./queries');

const RESULT = 0;

var bannUserCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which insert user into bann table failed!\n");
        console.log(error);
    }
    else {
        if (info.callback) info.callback("Success");
    }
}}

var alreadyBannCheckCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which checks if user is already banned failed!\n");
        console.log(error);
    }
    else {
        if (!rows.length) {
            info.connection.query(queries.bannUser,
                [info.id, info.bannDate], bannUserCallback(info));
        }
        else if (info.callback) info.callback("UserAlreadyBanned");
    }
}}

var checkAdminCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which checks if username is admin failed!\n");
        console.log(error);
    }
    else {
        if (!rows.length) {
            info.connection.query(queries.checkIfUserIsBanned,
                [info.id], alreadyBannCheckCallback(info));
        }
        else if (info.callback) info.callback("UserIsAdmin");
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
            info.connection.query(queries.checkIfAdminExists,
                [info.username], checkAdminCallback(info));
        }
        else if (info.callback) info.callback("UserNotFound");
    }
}}

var bannUserModule = function(connection, username, bannDate, callback) {

    info = {
        connection: connection,
        username: username,
        bannDate: bannDate,
        callback: callback
    }

    info.connection.query(queries.searchInUserByUsername, [info.username], usernameCheckCallback(info));
}

module.exports = bannUserModule;
