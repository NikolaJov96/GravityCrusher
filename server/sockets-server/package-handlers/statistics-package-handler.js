// Owner: Filip Mandic (mandula8)

// Summary: This file contains handler for getting statistics

var db = require('../../sql-server/database-interface.js');

var callbackFunction = function(socket, data) { return function(status, table, maxRow) {
    response = {
        status: status,
        metrics: serverState.statisticsColumns,
        default: 'Games Won',
        data: table,
        maxRow: maxRow
    };
    socket.emit('getStatisticsResponse', response);
}};

module.exports = function(socket){ return function(data){
    logMsg('Get statistics: Data: ');
    logMsg(data);
    socket.user.interaction = true;

    if (data.mode === 'user')
        db.getStatisticsForUser(data.metric, data.rowCount, data.username, callbackFunction(socket, data));
    else db.getStatisticsForPosition(data.metric, data.rowCount, data.startPosition, callbackFunction(socket, data));
}};
