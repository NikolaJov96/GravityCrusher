// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for reset password for user

var queries = require('./queries');
var updateToken = require('./token-updating-submodule');

const RESULT = 0;

var requestDeleteCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        info.connection.rollback(function() {
            console.log("error: query that deletes request failed!\n");
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
                updateToken(info.connection, info.user_id);
                if (info.callback) info.callback("Success");
            }
        });
    }
}}


var changeInfoInUserCallback = function(info) { return function(error, rows, fields) {
    if (!!error){
        info.connection.rollback(function() {
            console.log("error: query that changes hash and salt failed, transaction rollback!\n");
            console.log(error);
        });
    }
    else {
        info.connection.query(queries.deleteFromPasswordReset, [info.user_id], requestDeleteCallback(info));
    }
}}

var selectIdCallbackQuery = function(info) { return function(error, rows, fields) {
        if (!!error) {
            console.log("error: query which finds user by confirm code failed!\n");
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
                    info.connection.query(queries.setNewPasswordAndSalt,
                        [info.newHash, info.newSalt, info.user_id], changeInfoInUserCallback(info));
                });

            }
            else if (info.callback) info.callback("RequestCodeNoMatch");
        }
}}

var resetPasswordModule = function(connection, requestCode, newHash, newSalt, callback) {

    info = {
        connection : connection,
        requestCode : requestCode,
        newHash : newHash,
        newSalt : newSalt,
        callback : callback
    }
    info.connection.query(queries.selectUserByConfirmCode, [info.requestCode], selectIdCallbackQuery(info));
}

module.exports = resetPasswordModule;
