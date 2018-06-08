// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for inserting new token by sending username

var queries = require('./queries');

const RESULT = 0;

var deleteTokenCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which deletes from token failed!\n");
        console.log(error);
    }
    else {
        if (info.callback) info.callback("Success");
    }
}}

var deleteOldTokensModule = function(connection, callback) {

    var date = new Date();

    info = {
        connection: connection,
        callback: callback
    }

    info.connection.query(queries.deleteOldTokens, [date], deleteTokenCallback(info));
}

module.exports = deleteOldTokensModule;
