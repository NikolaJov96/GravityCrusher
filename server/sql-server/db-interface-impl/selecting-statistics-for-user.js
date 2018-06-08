// Owner: Filip Mandic (mandula8)

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
            console.log('i: ' + i);
            var offset = Math.floor(i / info.rowCount);
            offset = offset * info.rowCount;
            console.log('offset: ' + offset);
            console.log('rowCount: ' + info.rowCount);
            console.log("------------");
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

/*
info.offset = Math.floor((info.activeUsersCount + 1) / 10);
info.offset *= 10;

var callbackTableToPass = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which selects data failed!\n");
            console.log(error);
        }
        else {

            var j = info.offset + 1;
            var outputResult = [];
            for(var i in rows) {
                outputResult[i] = {
                    'Rank': j++,
                    'Username':  rows[i].username,
                    'Games Played': rows[i].games_played_count,
                    'Games Won': rows[i].games_won_count,
                    'Games Won Percentage': (rows[i].games_played_count != 0) ?
                        (rows[i].games_won_count / rows[i].games_played_count * 100) : (0),
                }
            }

            if (info.callback) info.callback("Success", outputResult, info.activeUsersCount);
        }
}}

var callbackFront = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which finds better ranged users count failed!\n");
            console.log(error);
        }
        else {
            for(var key in rows[RESULT]) info.frontUsersCount = rows[RESULT][key];
            info.backUsersCount = info.activeUsersCount - info.frontUsersCount - 1;

            var offset = 0;
            var half = parseInt(info.rowCount / 2, 10);

            if ((info.frontUsersCount > half) && (info.backUsersCount > half))
                offset = info.frontUsersCount - half;
            else if (info.backUsersCount <= half)
                    offset = info.frontUsersCount - info.rowCount + info.backUsersCount + 1;
            info.offset = offset;

            info.connection.query(queries.selectStatistics,
                [offset, info.metric, info.secondMetric, info.rowCount, offset], callbackTableToPass(info));
        }
}}

var callbackActiveUsers = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which finds users count failed!\n");
            console.log(error);
        }
        else {
            for(var key in rows[RESULT]) info.activeUsersCount = rows[RESULT][key];

            if (info.activeUsersCount <= info.rowCount) {
                //pozovi upit koji odmah izvrsi dohvatanje rezultata sa offsetom 0
                info.connection.query(queries.selectStatistics,
                    [START_OFFSET, info.metric, info.secondMetric, info.rowCount, START_OFFSET], callbackTableToPass(info));
            }
            else {
                info.connection.query(queries.getActiveUsersInFrontCount,
                    [info.metric, info.columnValue], callbackFront(info));
            }
        }
}}

var selectCallbackQuery = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which search for users statistics failed!\n");
            console.log(error);
        }
        else {
            if (!!rows.length) {
                for(var key in rows[0]) info.columnValue = rows[0][info.metric];

                info.connection.query(queries.getActiveUsersCount,
                    [], callbackActiveUsers(info));
            }
            else if (info.callback) info.callback("InvalidUser", null, null);
        }
}}

var getStatisticsModule = function(connection, metric, rowCount, username, statNamesToColumns, callback) {

    if (! metric in statNamesToColumns) return;

    var secondMetric = "Games Won Percentage";
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
*/
