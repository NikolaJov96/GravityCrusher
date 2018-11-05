// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks used to select statistics for position

var queries = require('./queries');

const RESULT = 0;
const START_OFFSET = 0;

var callbackTableToPass = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which selects data failed!\n");
            console.log(error);
        }
        else {

            var j = info.start + 1;
            var outputResult = [];
            for(var i in rows) {
                outputResult[i] = {
                    'Rank': j++,
                    'Username': rows[i].username,
                    'Games Played': rows[i].games_played_count,
                    'Games Won': rows[i].games_won_count,
                    'Games Won Percentage': (rows[i].games_played_count != 0) ?
                        (rows[i].games_won_count / rows[i].games_played_count * 100) : (0),
                }

            }

            if (info.callback) info.callback("Success", outputResult, info.activeUsersCount);
        }
}}

var selectCallbackQuery = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which search for users statistics failed!\n");
            console.log(error);
        }
        else {
            for(var key in rows[RESULT]) info.activeUsersCount = rows[RESULT][key];

            if(info.start <= 0 || info.activeUsersCount <= info.rowCount) info.start = 0;
            else info.start--;

            info.connection.query(queries.selectStatistics,
                [info.start, info.metric, info.secondMetric, info.rowCount, info.start], callbackTableToPass(info));
        }
}}

var getStatisticsModule = function(connection, metric, rowCount, start, statNamesToColumns, callback) {

    if (! metric in statNamesToColumns) return;

    var secondMetric = "Games Won Percentage";
    if (metric === "Games Won Percentage") secondMetric = "Games Played";

    info = {
        connection : connection,
        metric : statNamesToColumns[metric],
        secondMetric: statNamesToColumns[secondMetric],
        rowCount : rowCount,
        start : start,
        callback : callback
    }

    info.connection.query(queries.getActiveUsersCount, [], selectCallbackQuery(info));
}

module.exports = getStatisticsModule;
