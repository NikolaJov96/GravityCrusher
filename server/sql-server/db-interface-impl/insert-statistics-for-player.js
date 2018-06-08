// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for insert new statistics into database

var queries = require('./queries');
var updateToken = require('./token-updating-submodule');

const RESULT = 0;

var updateStatisticsCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which updates statistics failed!\n");
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
            if (info.outcome === 'Won')
                info.connection.query(queries.updateStatisticsWon, [info.id], updateStatisticsCallback(info));
            else {
                info.connection.query(queries.updateStatisticsLost, [info.id], updateStatisticsCallback(info));
        }}
        else if (info.callback) info.callback("UserNotFound");
    }
}}

var insertStatisticsModule = function(connection, username, outcome, callback) {
    info = {
        connection: connection,
        username: username,
        outcome: outcome,
        callback: callback
    }

    info.connection.query(queries.searchInUserByUsername, [info.username], usernameCheckCallback(info));
}

module.exports = insertStatisticsModule;
