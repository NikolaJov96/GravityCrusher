// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Functions and callbacks for inserting new user

var queries = require('./queries');

var insertNotConfirmedUserCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        info.connection.rollback(function() {
            console.log("error: query that inserts into user_not_confirmed failed!\n");
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
                if (info.callCreateNewUser) {
                    info.callCreateNewUser("Success", info.email, info.username, info.confirmationCode);
                }
            }
        });
    }
}}

var insertIntoUser = function(info) { return function(error, rows, fields) {
    if (!!error){
        info.connection.rollback(function() {
            console.log("error: query that insert into user failed, transaction rollback!\n");
            console.log(error);
        });
    }
    else {
        info.connection.query(queries.insertNotConfirmedUser,
            [info.username, info.confirmationCode], insertNotConfirmedUserCallback(info));
    }
}}

var usernameCheckCallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which checks if username is used failed!\n");
        console.log(error);
    }
    else {
        if (!rows.length) {
            info.connection.beginTransaction(function(error) {
                if (!!error) {
                    console.log("error: transaction failed to be started!\n");
                    console.log(error);
                }
                info.connection.query(queries.insertUser,
                    [info.username, info.email, info.passwordHash, info.passwordSalt], insertIntoUser(info));
            });
        }
        else {
            if (info.callCreateNewUser) {
                info.callCreateNewUser("UsernameTaken", info.email, info.username, info.confirmationCode);
            }
        }
    }
}}

var emailCheckcallback = function(info) { return function(error, rows, fields) {
    if (!!error) {
        console.log("error: query which checks if email is used failed!\n");
        console.log(error);
    }
    else {
        if (!rows.length) {
            info.connection.query(queries.searchInUserByUsername, [info.username], usernameCheckCallback(info));
        }
        else {
            if (info.callCreateNewUser)
                info.callCreateNewUser("EmailTaken", info.email, info.username, info.confirmationCode);
        }
    }
}}

var createNewUser = function(connection, username, email,
     passwordHash, passwordSalt, confirmationCode, callCreateNewUser) {

    info = {
        connection: connection,
        username: username,
        email: email,
        passwordHash:passwordHash,
        passwordSalt: passwordSalt,
        confirmationCode: confirmationCode,
        callCreateNewUser: callCreateNewUser
    }

    info.connection.query(queries.checkIfEmailExists, [info.email], emailCheckcallback(info));
}

module.exports = createNewUser;
