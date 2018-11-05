// Owner: Filip Mandic 2015/0308 (mandula8)

// Summary: Database object methods to work with database

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

    methods.createNewUser = function(email, username, passwordHash,
        passwordSalt, confirmationCode, callback) {

        insertUserQuery(methods.connection, username, email,
            passwordHash, passwordSalt, confirmationCode, callback);
	};

    methods.changePassword = function(username, oldHash, newHash, newSalt, callback) {

        changePasswordQuery(methods.connection, username, oldHash, newHash, newSalt, callback);
    };

    methods.changeUsername = function(oldUsername, newUsername, callback) {

        changeUsernameQuery(methods.connection, oldUsername, newUsername, callback);
    };

    methods.createPasswordRecoveryRequest = function(email, requestCode, callback) {

        passwordRecoveryRequest(methods.connection, email, requestCode, callback);
    };

    methods.getSaltByUsername = function(username, callback) {

        selectingSaltByUsername(methods.connection, username, callback);
    };

    methods.getSaltByEmail = function(email, callback) {

        selectingSaltByEmail(methods.connection, email, callback);
    }

    methods.assignTokenByUsername = function(username, token, callback) {

        insertingTokenByUsername(methods.connection, username, token, callback);
    }

    methods.assignTokenByEmail = function(email, token, callback) {

        insertingTokenByEmail(methods.connection, email, token, callback);
    }

    methods.verifyUserByUsername = function(username, hash, callback) {

        verifyingUserByUsername(methods.connection, username, hash, callback);
    }

    methods.verifyUserByEmail = function(email, hash, callback) {

        verifyingUserByEmail(methods.connection, email, hash, callback);
    }

    methods.verifyRegistrationByUsername = function(username, confirmCode, callback) {

        verifyingRegByUsername(methods.connection, username, confirmCode, callback);
    }

    methods.verifyRegistrationByEmail = function(email, confirmCode, callback) {

        verifyingRegByEmail(methods.connection, email, confirmCode, callback);
    }

    methods.getUsernameByToken = function(token, callback) {

        selectingUsernameWithTokenCode(methods.connection, token, callback);
    }

    methods.removeToken = function(token, callback) {

        removingUsernameToken(methods.connection, token, callback);
    }

    methods.resetPassword = function(requestCode, newHash, newSalt, callback) {

        resetPasswordModule(methods.connection, requestCode, newHash, newSalt, callback);
    }

    methods.deactivateAccount = function(token, callback) {

        deactivateAccountModule(methods.connection, token, callback);
    }

    methods.checkIfUserExists = function(username, callback) {

        userCheckModule(methods.connection, username, callback);
    }

    methods.getStatisticsForUser = function(metric, rowCount, username, callback) {

        selectingStatisticsForUserModule(methods.connection, metric, rowCount, username, statNamesToColumns, callback);
    }

    methods.getStatisticsForPosition = function(metric, rowCount, start, callback) {

        selectingStatisticsForPositionModule(methods.connection, metric, rowCount, start, statNamesToColumns, callback);
    }

    methods.bannUser = function(username, bannDate, callback) {

        bannUserModule(methods.connection, username, bannDate, callback);
    }

    methods.insertStatisticsForPlayer = function(username, outcome, callback) {

        insertStatisticsModule(methods.connection, username, outcome, callback);
    }

    methods.removeOldBanns = function(callback) {

        removeOldBannsModule(methods.connection, callback);
    }

    methods.removeOldTokens = function(callback) {

        removeUnactiveTokensModule(methods.connection, callback);
    }

    methods.removeOldNotConfirmedUsers = function(callback) {

        removeOldNotConfirmedUsersModule(methods.connection, callback);
    }

    methods.selectGameMaps = function(callback) {

        selectGameMapNamesModule(methods.connection, callback);
    }

    methods.selectObjectsOnMap = function(mapName, callback) {

        selectAllObjectsOnMapModule(methods.connection, mapName, callback);
    }

    methods.changeAvatar = function(username, filename, callback) {

        changeAvatarModule(methods.connection, username, filename, callback);
    }

    methods.getAvatar = function(username, callback) {

        getAvatarModule(methods.connection, username, callback);
    }

    methods.clearUser = function(email, callback) {

        deleteUnconfirmedUser(methods.connection, email, callback);
    }

    //-----------------------------------------------------------------------------------------------------------------

    methods.disconnect = function() {
        methods.connection.end();
        console.log("Object is no longer connected to database");
    }

    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------

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
