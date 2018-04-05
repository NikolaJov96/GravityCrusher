// Owner: Filip Mandic (mandula8)

// Summary: Functions and callbacks for selecting salt

var queries = require('./queries');

const RESULT = 0;

var callbackQuery = function(info) { return function(error, rows, fields) {
        if (!!error) throw error;
        else {
            if (!!rows.length)
                if (info.callback) info.callback("SUCCESS", rows[RESULT].password_salt);
            else if (info.callback) info.callback("UserNotRegistered", null);
        }
}}

var getSaltByUsernameQuery = function(connection, username, callback) {

    info = {
        connection : connection,
        username : username,
        callback : callback
    }

    info.connection.query(queries.getUserSalt, [info.username], callbackQuery(info));
}

module.exports = getSaltByUsernameQuery;