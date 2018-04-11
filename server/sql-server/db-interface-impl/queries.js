// Owner: Filip Mandic (mandula8)

// Summary: All the mySQL queries used in application\

module.exports = {

    //tables: USER ----------------------------------------------------------------------------------------------------
    //input username, email, password_hash, password_salt
    insertUser : "INSERT INTO user(username, email, password_hash, password_salt) VALUES (?, ?, ?, ?)",

    //input email
    checkIfEmailExists : "SELECT * FROM user WHERE email = ?",

    //input username
    searchInUserByUsername : "SELECT * FROM user WHERE username = ?",

    //input password_hash, password_salt
    setNewPasswordAndSalt: "UPDATE user SET password_hash = ?, password_salt = ? WHERE id = ?",

    //input newUsername, id
    setNewUsername: "UPDATE user SET username = ? WHERE id = ?",

    //tables: USER_NOT_CONFIRMED --------------------------------------------------------------------------------------
    //input id from user
    seachInUserNotCnfirmed : "SELECT * FROM user_not_confirmed WHERE user_id = ?",

    //input username, confirm_code
    insertNotConfirmedUser : "INSERT INTO user_not_confirmed(user_id, confirm_code) VALUES ((SELECT id FROM user WHERE username = ?), ?)",

    //input id
    deleteFromUserNotConfirmed: "DELETE FROM user_not_confirmed WHERE user_id = ?",

    //tables: STATISTICS ----------------------------------------------------------------------------------------------
    //input id
    insertUserInStatistics: "INSERT INTO statistics(user_id) VALUES (?)",

    //tables: USER_PASSWORD_RESET -------------------------------------------------------------------------------------
    //input id, confirm_code
    insertIntoPasswordReset: "INSERT INTO user_password_reset(user_id, confirm_code) VALUES (?, ?)",

    //input id
    searchInPasswordReset: "SELECT * FROM user_password_reset WHERE user_id = ?",

    //input id
    deleteFromPasswordReset: "DELETE FROM user_password_reset WHERE user_id = ?",

    //tables: USER_BANNED ---------------------------------------------------------------------------------------------
    //input id
    checkIfUserIsBanned: "SELECT * FROM user_banned WHERE user_id = ?",

    //input username, bann date
    bannUser : "INSERT INTO user_banned(user_id, bann_date) VALUES ((select id FROM user WHERE username = ?), ?)",

    //tables: USER_DISABLED -------------------------------------------------------------------------------------------
    //input id
    checkIfUserIsDisabled: "SELECT * FROM user_disabled WHERE user_id = ?",

    //input username
    disableUser : "INSERT INTO user_disabled(user_id) VALUES ((select id FROM user WHERE username = ?))",

    //tables: TOKEN----------------------------------------------------------------------------------------------------
    //input id_user
    insertNewToken: "INSERT INTO token(user_id, token_code) VALUES (?, ?)",

    getTokenInfo: "SELECT * FROM token WHERE id = ?",
}