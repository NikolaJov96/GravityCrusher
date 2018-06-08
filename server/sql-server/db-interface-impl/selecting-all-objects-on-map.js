// Owner: Filip Mandic (mandula8)

// Summary: Functions and callbacks selecting all objects from game map

var queries = require('./queries');

const RESULT = 0;

var selectObjectsCallback = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which search in user for username failed!\n");
            console.log(error);
        }
        else {

            var outputResult = [];
            for(var i in rows) {
                outputResult[i] = {
                    'PositionX': rows[i].position_x,
                    'PositionY': rows[i].position_y,
                    'Mass': rows[i].mass
                }

            }

            if (info.callback) info.callback("Success", outputResult);
        }
}}

var mapCheckCallback = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which search in user for username failed!\n");
            console.log(error);
        }
        else {
            if (!!rows.length) {
                info.id = rows[RESULT].id;
                info.connection.query(queries.getObjectsOnMap, [info.id], selectObjectsCallback(info));

            } else if (info.callback) info.callback("MapNotFound", null);
        }
}}

var selectingObjectsModule = function(connection, mapName, callback) {

    info = {
        connection : connection,
        mapName : mapName,
        callback : callback
    }

    info.connection.query(queries.checkIfMapExists, [info.mapName], mapCheckCallback(info));
}

module.exports = selectingObjectsModule;
