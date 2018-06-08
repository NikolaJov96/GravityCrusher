// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for selecting all game map names

var queries = require('./queries');

const RESULT = 0;

var callbackQuery = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which search in user for username failed!\n");
        console.log(error);
    }
    else {
        if (!!rows.length) {

            var outputResult = [];
            for(var i in rows) {
                outputResult[i] = {
                    'name': rows[i].name
                }

            }

            if (info.callback) info.callback("Success", outputResult);

        } else if (info.callback) info.callback("NoMapsYET", null);
    }
}}

var selectingGameMapsModule = function(connection, callback) {

    info = {
        connection : connection,
        callback : callback
    }
    info.connection.query(queries.getAllMapsNames, [], callbackQuery(info));
}

module.exports = selectingGameMapsModule;
