// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for deleting token from table

var queries = require('./queries');

const RESULT = 0;

var deleteCallbackQuery = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which deletes token failed!\n");
            console.log(error);
        }
        else if (info.callback) info.callback("Success");
}}

var selectCallbackQuery = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which finds token failed!\n");
            console.log(error);
        }
        else {
            if (!!rows.length) {
                info.connection.query(queries.deleteToken, [info.token], deleteCallbackQuery(info));
            }
            else if (info.callback) info.callback("TokenNoMatch");
        }
}}

var getUsernameByTokenCode = function(connection, token, callback) {

    info = {
        connection : connection,
        token : token,
        callback : callback
    }
    info.connection.query(queries.searchTokenWithTokenCode, [info.token], selectCallbackQuery(info));
}

module.exports = getUsernameByTokenCode;
