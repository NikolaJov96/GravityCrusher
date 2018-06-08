// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks removing old registrations which are not finished

var queries = require('./queries');

const RESULT = 0;
const REGISTRATION_TIMEOUT = 2; //two hours

var callbackQuery = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which deletes from user failed!\n");
            console.log(error);
        }
        else if (info.callback) info.callback("Success");
}}

var removeNotConfirmedModule = function(connection, callback) {

    info = {
        connection : connection,
        callback : callback
    }

    var date = new Date();
    date.setHours(date.getHours() - REGISTRATION_TIMEOUT);

    info.connection.query(queries.deleteOldUnfinishedRegistrations, [date], callbackQuery(info));
}

module.exports = removeNotConfirmedModule;
