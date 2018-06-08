// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for finding username who has passed token

var queries = require('./queries');

const RESULT = 0;
const TOKEN_LIFETIME = 14;

var adminCheckCallback = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which updates tokens valid time failed!\n");
            console.log(error);
        }
        else {
            var isAdmin = false;
            if (!!rows.length) isAdmin = true;

            if (info.callback) {
                info.callback("Success", info.username, isAdmin);
            }
        }
}}

var updateTokenLifetimeCallback = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which updates tokens valid time failed!\n");
            console.log(error);
        }
        else {
            info.connection.query(queries.checkIfAdminExists, [info.username],
                adminCheckCallback(info));

        }
}}

var callbackQuery = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which finds username by token code failed!\n");
            console.log(error);
        }
        else {
            if (!!rows.length) {
                info.username = rows[RESULT].username;
                var date = new Date();
                date.setDate(date.getDate() + TOKEN_LIFETIME);
                info.connection.query(queries.updateTokenLifetime, [date, info.token],
                    updateTokenLifetimeCallback(info));
            }
            else if (info.callback) info.callback("TokenNoMatch", null, false);
        }
}}

var getUsernameByTokenCode = function(connection, token, callback) {

    info = {
        connection : connection,
        token : token,
        callback : callback
    }
    info.connection.query(queries.findUsernameByTokenCode, [info.token], callbackQuery(info));
}

module.exports = getUsernameByTokenCode;
