// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for updating token

var queries = require('./queries');

const TOKEN_LIFETIME = 14;

var callbackQuery = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which updates token for user in submodule failed!\n");
            console.log(error);
        }
}}

var updatingTokenModule = function(connection, id) {

    var date = new Date();
    date.setDate(date.getDate() + TOKEN_LIFETIME);

    if (id != null) info.connection.query(queries.updateTokensForUsername, [date, id], callbackQuery(info));
}

module.exports = updatingTokenModule;
