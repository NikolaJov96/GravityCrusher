// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for deactivating account

var queries = require('./queries');
var updateToken = require('./token-updating-submodule');

const RESULT = 0;

var insertInDisableUsersCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        info.connection.rollback(function() {
            console.log("error: query that inserts in disabled users failed!\n");
            console.log(error);
        });
    }
    else {
        info.connection.commit(function(error) {
            if (!!error) {
                info.connection.rollback(function() {
                    console.log("error: transaction could not be commited, transaction rollback!\n");
                    console.log(error);
                });
            }
            else {
                if (info.callback) {
                    updateToken(info.connection, info.user_id);
                    info.callback("Success", info.tokensInTable);
                }
            }
        });
    }
}}

var tokenDeletesCallback = function(info) { return function(error, rows, fields) {
    if (!!error){
        info.connection.rollback(function() {
            console.log("error: query that deletes all tokens from user failed, transaction rollback!\n");
            console.log(error);
        });
    }
    else {
        info.connection.query(queries.disableUser, [info.user_id], insertInDisableUsersCallback(info));
    }
}}

var findTokensIdCallback = function(info) { return function(error, rows, fields) {
    if (!!error){
        info.connection.rollback(function() {
            console.log("error: query that finds all tokens failed, transaction rollback!\n");
            console.log(error);
        });
    }
    else {
        info.connection.query(queries.deleteAllTokensFromUser, [info.user_id], tokenDeletesCallback(info));
    }
}}

var findTokensIdCallback = function(info) { return function(error, rows, fields) {
    if (!!error){
        info.connection.rollback(function() {
            console.log("error: query that finds all tokens failed, transaction rollback!\n");
            console.log(error);
        });
    }
    else {
        info.tokensInTable = [];
        for (var i = 0; i < rows.length; i++) info.tokensInTable[i] = rows[i].token_code;
        info.connection.query(queries.selectAllTokenCodesFromUser, [info.user_id], tokenDeletesCallback(info));
    }
}}

var selectCallbackQuery = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which finds token failed!\n");
            console.log(error);
        }
        else {
            if (!!rows.length) {
                info.user_id = rows[RESULT].user_id;
                info.connection.beginTransaction(function(error) {
                    if (!!error) {
                        console.log("error: transaction failed to be started!\n");
                        console.log(error);
                    }
                    info.connection.query(queries.selectAllTokenCodesFromUser,
                        [info.user_id], findTokensIdCallback(info));
                });

            }
            else if (info.callback) info.callback("TokenNoMatch", null);
        }
}}

var deactivateAccountModule = function(connection, token, callback) {

    info = {
        connection : connection,
        token : token,
        callback : callback
    }
    info.connection.query(queries.searchTokenWithTokenCode, [info.token], selectCallbackQuery(info));
}

module.exports = deactivateAccountModule;
