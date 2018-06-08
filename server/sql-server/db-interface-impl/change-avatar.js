// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for changing avatar for username

var queries = require('./queries');
var updateToken = require('./token-updating-submodule');

const RESULT = 0;

var updateCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which updates avatar failed!\n");
        console.log(error);
    }
    else {
        updateToken(info.connection, info.id);
        if (info.callback) info.callback("Success");
    }
}}

var usernameCheckCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which search for username failed!\n");
        console.log(error);
    }
    else {
        if (!!rows.length) {
            info.id = rows[RESULT].id;
            info.connection.query(queries.setAvatar, [info.filename, info.id], updateCallback(info));
        }
        else if (info.callback) info.callback("UserNotRegistered");
    }
}}


var getAvatarForUser = function(connection, username, filename, callback) {

    info = {
        connection : connection,
        username : username,
        filename : filename,
        callback : callback
    }
    info.connection.query(queries.searchInUserByUsername, [info.username], usernameCheckCallback(info));
}

module.exports = getAvatarForUser;
