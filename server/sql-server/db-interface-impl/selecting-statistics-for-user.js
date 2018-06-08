// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for deleting token from table

var queries = require('./queries');

const RESULT = 0;

var sortedListUsersCallback = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which finds users count failed!\n");
            console.log(error);
        }
        else {
            var i = 0;
            while( rows[i].id !== info.id) i++;
            var offset = Math.floor(i / info.rowCount);
            offset = offset * info.rowCount;
            var i = offset;
            var outputResult = [];
            var j = 0;
            while((i < rows.length) && (j < info.rowCount)) {
                outputResult[j] = {
                    'Rank': i + 1,
                    'Username':  rows[i].username,
                    'Games Played': rows[i].games_played_count,
                    'Games Won': rows[i].games_won_count,
                    'Games Won Percentage': (rows[i].games_played_count != 0) ?
                        (rows[i].games_won_count / rows[i].games_played_count * 100) : (0),
                }
                i++;
                j++;
            }

            if (info.callback) info.callback("Success", outputResult, rows.length);
        }
}}

var selectCallbackQuery = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which search for users statistics failed!\n");
            console.log(error);
        }
        else {
            if (!!rows.length) {
                info.columnValueFirst = rows[0][info.metric];
                info.columnValueSecond = rows[0][info.secondMetric];
                info.id = rows[0]['id'];

                // console.log(rows[0]);
                // console.log(info.metric);
                // console.log(info.secondMetric);
                // console.log(info.columnValueFirst);
                // console.log(info.columnValueSecond);
                // console.log(info.id);

                info.connection.query(queries.getSortedList,
                    [info.metric, info.secondMetric], sortedListUsersCallback(info));
            }
            else if (info.callback) info.callback("InvalidUser", null, null);
        }
}}

var getStatisticsModule = function(connection, metric, rowCount, username, statNamesToColumns, callback) {

    if (! metric in statNamesToColumns) return;

    var secondMetric = "Games Won Percentage";
    var otherMemMetric = "Games Played";
    if (metric === "Games Won Percentage") secondMetric = "Games Played";
    info = {
        connection : connection,
        metric : statNamesToColumns[metric],
        secondMetric: statNamesToColumns[secondMetric],
        rowCount : rowCount,
        username : username,
        callback : callback
    }

    info.connection.query(queries.selectUsersStatistics, [info.username], selectCallbackQuery(info));
}

module.exports = getStatisticsModule;
