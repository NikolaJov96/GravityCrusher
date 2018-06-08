// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for selecting avatar for username

var queries = require('./queries');
var updateToken = require('./token-updating-submodule');

const RESULT = 0;

var callbackQuery = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which search for username failed!\n");
        console.log(error);
    }
    else {
        if (!!rows.length) {
            updateToken(info.connection, info.id);
            if (info.callback) info.callback("Success", rows[RESULT].avatar);
        }
        else if (info.callback) info.callback("UserNotRegistered", null);
    }
}}


var getAvatarForUser = function(connection, username, callback) {

    info = {
        connection : connection,
        username : username,
        callback : callback
    }
    info.connection.query(queries.searchInUserByUsername, [info.username], callbackQuery(info));
}

module.exports = getAvatarForUser;
