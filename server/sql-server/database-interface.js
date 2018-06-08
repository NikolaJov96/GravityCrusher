// Owner: Filip Mandic (mandula8)

// Summary: Database object methods to work with database

/**
*This objects should be a facade for all database operations used
* after all db calls, methods should call callback function which will be passed as last argument
*
*@version 1.0
*/
var database = function() {

    var insertUserQuery = require('./db-interface-impl/insert-new-user');
	var selectingSaltByUsername = require('./db-interface-impl/selecting-salt-by-username');
    var selectingSaltByEmail = require('./db-interface-impl/selecting-salt-by-email');
    var changePasswordQuery = require('./db-interface-impl/change-password');
    var changeUsernameQuery = require('./db-interface-impl/change-username');
    var passwordRecoveryRequest = require('./db-interface-impl/create-password-recovery');
    var insertingTokenByUsername = require('./db-interface-impl/insert-token-by-username');
    var insertingTokenByEmail = require('./db-interface-impl/insert-token-by-email');
    var verifyingUserByUsername = require('./db-interface-impl/verify-user-by-username');
    var verifyingUserByEmail = require('./db-interface-impl/verify-user-by-email');
    var verifyingRegByUsername = require('./db-interface-impl/verify-registration-by-username');
    var verifyingRegByEmail = require('./db-interface-impl/verify-registration-by-email');
    var selectingUsernameWithTokenCode = require('./db-interface-impl/finding-username-with-token-code');
    var removingUsernameToken = require('./db-interface-impl/remove-token');
    var resetPasswordModule = require('./db-interface-impl/reset-password');
    var deactivateAccountModule = require('./db-interface-impl/deactivate-account');
    var userCheckModule = require('./db-interface-impl/user-check');
    var selectingStatisticsForUserModule = require('./db-interface-impl/selecting-statistics-for-user');
    var selectingStatisticsForPositionModule = require('./db-interface-impl/selecting-statistics-for-position');
    var insertStatisticsModule = require('./db-interface-impl/insert-statistics-for-player');
    var bannUserModule = require('./db-interface-impl/bann-user');
    var removeOldBannsModule = require('./db-interface-impl/remove-old-banns');
    var removeUnactiveTokensModule = require('./db-interface-impl/delete-unactive-tokens.js');
    var selectGameMapNamesModule = require('./db-interface-impl/selecting-game-map-names.js');
    var selectAllObjectsOnMapModule = require('./db-interface-impl/selecting-all-objects-on-map.js');
    var removeOldNotConfirmedUsersModule = require('./db-interface-impl/remove-old-not-cofirmed-users.js');
    var getAvatarModule = require('./db-interface-impl/get-avatar');
    var changeAvatarModule = require('./db-interface-impl/change-avatar');
    var deleteUnconfirmedUser = require('./db-interface-impl/delete-not-confirmed-user');
    var mysql = require('mysql');

    var statNamesToColumns = { 'Games Played': 'games_played_count',
                                'Games Won': 'games_won_count',
                                'Games Won Percentage': 'win_rate' };


    /**
    *Creating db connection
    */
	connectionInfo = require('./db-connection/db-connection-file');
    methods = {
        connection : mysql.createConnection({
            host: connectionInfo.host,
            user: connectionInfo.user,
            password: connectionInfo.password,
            database: connectionInfo.database
        })
    }
    //-----------------------------------------------------------------------------------------------------------------
    //---------------methods-------------------------------------------------------------------------------------------

    /**
    * Method for that inserts new user in system
    */
    methods.createNewUser = function(email, username, passwordHash,
        passwordSalt, confirmationCode, callback) {

        insertUserQuery(methods.connection, username, email,
            passwordHash, passwordSalt, confirmationCode, callback);
	};

    /**
    * Method for changing password for user which username is passed
    */
    methods.changePassword = function(username, oldHash, newHash, newSalt, callback) {

        changePasswordQuery(methods.connection, username, oldHash, newHash, newSalt, callback);
    };

    /**
    * Method for changing username for user
    */
    methods.changeUsername = function(oldUsername, newUsername, callback) {

        changeUsernameQuery(methods.connection, oldUsername, newUsername, callback);
    };

    /**
    * Method that stores password recovery requests
    */
    methods.createPasswordRecoveryRequest = function(email, requestCode, callback) {

        passwordRecoveryRequest(methods.connection, email, requestCode, callback);
    };

    /**
    * Method that selects password salt for user which username is passed
    */
    methods.getSaltByUsername = function(username, callback) {

        selectingSaltByUsername(methods.connection, username, callback);
    };

    /**
    * Method that selects password salt for user which email is passed
    */
    methods.getSaltByEmail = function(email, callback) {

        selectingSaltByEmail(methods.connection, email, callback);
    }

    /**
    * Method for saving token that belong to certain user which username is passed to database
    */
    methods.assignTokenByUsername = function(username, token, callback) {

        insertingTokenByUsername(methods.connection, username, token, callback);
    }

    /**
    * Method for saving token that belong to certain user which email is passed to database
    */
    methods.assignTokenByEmail = function(email, token, callback) {

        insertingTokenByEmail(methods.connection, email, token, callback);
    }

    /**
    * Method for verifying if user can sign in to his account if he enters username in sign in form
    */
    methods.verifyUserByUsername = function(username, hash, callback) {

        verifyingUserByUsername(methods.connection, username, hash, callback);
    }

    /**
    * Method for saving token that belong to certain user which email is passed to database
    */
    methods.verifyUserByEmail = function(email, hash, callback) {

        verifyingUserByEmail(methods.connection, email, hash, callback);
    }

    /**
    * Method verifying creating new account with username
    */
    methods.verifyRegistrationByUsername = function(username, confirmCode, callback) {

        verifyingRegByUsername(methods.connection, username, confirmCode, callback);
    }

    /**
    * Method verifying creating new account with email
    */
    methods.verifyRegistrationByEmail = function(email, confirmCode, callback) {

        verifyingRegByEmail(methods.connection, email, confirmCode, callback);
    }

    /**
    * Method that selectes username that possess passed token
    */
    methods.getUsernameByToken = function(token, callback) {

        selectingUsernameWithTokenCode(methods.connection, token, callback);
    }

    /**
    * Method that deletes passed token from database
    */
    methods.removeToken = function(token, callback) {

        removingUsernameToken(methods.connection, token, callback);
    }

    /**
    * Method that sets new password
    */
    methods.resetPassword = function(requestCode, newHash, newSalt, callback) {

        resetPasswordModule(methods.connection, requestCode, newHash, newSalt, callback);
    }

    /**
    * Method sends user to deactivated users
    */
    methods.deactivateAccount = function(token, callback) {

        deactivateAccountModule(methods.connection, token, callback);
    }

    /**
    * Method that checks if user exists in system
    */
    methods.checkIfUserExists = function(username, callback) {

        userCheckModule(methods.connection, username, callback);
    }

    /**
    * Method that selectes part of statistics table in which is user
    */
    methods.getStatisticsForUser = function(metric, rowCount, username, callback) {

        selectingStatisticsForUserModule(methods.connection, metric, rowCount, username, statNamesToColumns, callback);
    }

    /**
    * Method that selects part of statistics table from passed position
    */
    methods.getStatisticsForPosition = function(metric, rowCount, start, callback) {

        selectingStatisticsForPositionModule(methods.connection, metric, rowCount, start, statNamesToColumns, callback);
    }

    /**
    * Method that puts user into bann table
    */
    methods.bannUser = function(username, bannDate, callback) {

        bannUserModule(methods.connection, username, bannDate, callback);
    }

    /**
    * Method that updates for statistics
    */
    methods.insertStatisticsForPlayer = function(username, outcome, callback) {

        insertStatisticsModule(methods.connection, username, outcome, callback);
    }

    /**
    * Method called periodically to clear bans that expired
    */
    methods.removeOldBanns = function(callback) {

        removeOldBannsModule(methods.connection, callback);
    }

    /**
    * Method called periodically to clear tokens that expired
    */
    methods.removeOldTokens = function(callback) {

        removeUnactiveTokensModule(methods.connection, callback);
    }

    /**
    * Method called periodically to clear registration that expired
    */
    methods.removeOldNotConfirmedUsers = function(callback) {

        removeOldNotConfirmedUsersModule(methods.connection, callback);
    }

    /**
    * Method that selects all maps
    */
    methods.selectGameMaps = function(callback) {

        selectGameMapNamesModule(methods.connection, callback);
    }

    /**
    * Method for that selects all planets on map
    */
    methods.selectObjectsOnMap = function(mapName, callback) {

        selectAllObjectsOnMapModule(methods.connection, mapName, callback);
    }

    /**
    * Method that change avatar for user
    */
    methods.changeAvatar = function(username, filename, callback) {

        changeAvatarModule(methods.connection, username, filename, callback);
    }

    /**
    * Method for that selects avatar for passed user
    */
    methods.getAvatar = function(username, callback) {

        getAvatarModule(methods.connection, username, callback);
    }

    /**
    * Method that deletes certain user from not confirmed table
    */
    methods.clearUser = function(email, callback) {

        deleteUnconfirmedUser(methods.connection, email, callback);
    }

    //-----------------------------------------------------------------------------------------------------------------

    /**
    * Method for disconnecting object from db
    */
    methods.disconnect = function() {
        methods.connection.end();
        console.log("Object is no longer connected to database");
    }

    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------

    /**
    *Connecting to db
    */
    methods.connection.connect(function(error) {
        if (!!error) {
            console.log('Error: connection to the database failed!');
        }
        else {
            console.log('Connected to database');
        }
    });

   	return methods;
}

module.exports = database();
