// Owner: Filip Mandic 2015/0308 (mandula8)

/**
*Summary: Dictionary with all the mySQL queries used in application
*/

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

    //input filename, id
    setAvatar: "UPDATE user SET avatar = ? WHERE id = ?",

    //input id
    deleteNotConfirmedUser: "DELETE FROM user WHERE id = ?",

    //tables: USER_NOT_CONFIRMED --------------------------------------------------------------------------------------
    //input id from user
    seachInUserNotCnfirmed : "SELECT * FROM user_not_confirmed WHERE user_id = ?",

    //input username, confirm_code
    insertNotConfirmedUser : `INSERT INTO user_not_confirmed(user_id, confirm_code)
                              VALUES ((SELECT id FROM user WHERE username = ?), ?)`,

    //input id
    deleteFromUserNotConfirmed: "DELETE FROM user_not_confirmed WHERE user_id = ?",

    //input create date
    deleteOldUnfinishedRegistrations: `DELETE FROM user
                                       WHERE create_date < ?
                                       AND user.id IN (SELECT user_id FROM user_not_confirmed)`,

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

    //input confirm code
    selectUserByConfirmCode: "SELECT * FROM user_password_reset WHERE confirm_code = ?",

    //tables: USER_BANNED ---------------------------------------------------------------------------------------------
    //input id
    checkIfUserIsBanned: "SELECT * FROM user_banned WHERE user_id = ?",

    //input id, bann date
    bannUser : "INSERT INTO user_banned(user_id, bann_date) VALUES (?, ?)",

    //input this day
    deleteOldBanns: "DELETE FROM user_banned WHERE ? > bann_date",

    //tables: USER_DISABLED -------------------------------------------------------------------------------------------
    //input id
    checkIfUserIsDisabled: "SELECT * FROM user_disabled WHERE user_id = ?",

    //input username
    disableUser : "INSERT INTO user_disabled(user_id) VALUES (?)",

    //input id
    reactivateUser: "DELETE FROM user_disabled WHERE user_id = ?",

    //tables: TOKEN----------------------------------------------------------------------------------------------------
    //input id_user
    insertNewToken: "INSERT INTO token(user_id, token_code, token_valid_date) VALUES (?, ?, ?)",

    //input token id
    getTokenInfo: "SELECT * FROM token WHERE id = ?",

    //input token code
    findUsernameByTokenCode: "SELECT * FROM user, token WHERE user.id = token.user_id AND token.token_code = ?",

    //input token code
    deleteToken: "DELETE FROM token WHERE token_code = ?",

    //input token_code
    searchTokenWithTokenCode: "SELECT * FROM token WHERE token_code = ?",

    //input user id
    selectAllTokenCodesFromUser: "SELECT token_code FROM token WHERE user_id = ?",

    //input user_id
    deleteAllTokensFromUser: "DELETE FROM token WHERE user_id = ?",

    //this day
    deleteOldTokens: "DELETE FROM token WHERE ? > token_valid_date",

    //input new valid date, token code
    updateTokenLifetime: "UPDATE token SET token_valid_date = ? WHERE token_code = ?",

    //input new valid date, user id
    updateTokensForUsername: "UPDATE token SET token_valid_date = ? WHERE user_id = ?",

    //tables:statistics, user, user_disabled---------------------------------------------------------------------------

    //input username
    selectUsersStatistics: `SELECT u.id, games_played_count, games_won_count,
                                (games_won_count/GREATEST(games_played_count, 1)) as win_rate
                            FROM user u INNER JOIN statistics s ON u.id = s.user_id
                            WHERE u.username  = ?;`,

    getSortedList :      `SELECT id, user.username, games_won_count, games_played_count,
                            (games_won_count/GREATEST(games_played_count, 1)) as win_rate
                          FROM psi.user INNER JOIN psi.statistics ON psi.user.id = psi.statistics.user_id
                          WHERE NOT EXISTS (SELECT * FROM user_disabled ud WHERE id = ud.user_id)
                          ORDER BY ?? DESC, ?? DESC, user.username ASC;`,

    //input column to check, params
    getActiveUsersInFrontCount: `SELECT u.username
                                 FROM statistics sm INNER JOIN
                                    (SELECT user_id, (games_won_count/GREATEST(games_played_count, 1)) as win_rate
                                    FROM statistics) st ON sm.user_id = st.user_id
                                    INNER JOIN user u ON st.user_id = u.id
                                 WHERE (
                                     (?? > ?)
                                 OR (?? = ? AND ?? < ?)
                                 OR (?? = ? AND ?? = ? AND u.username < ?)
                                 )
                                 AND NOT EXISTS (SELECT * FROM user_disabled ud WHERE ud.user_id = sm.user_id)`,

    //without input
    getActiveUsersCount:   `SELECT COUNT(*)
                            FROM statistics
                            WHERE NOT EXISTS (SELECT * FROM user_disabled WHERE user_id = statistics.user_id)`,

    //input integers - number of rows to return and offset
    selectStatistics:  `SELECT @ROW := @ROW + 1 AS row, user.username, statistics.games_played_count,
                            statistics.games_won_count, (games_won_count/GREATEST(games_played_count, 1)) as win_rate
                        FROM user, statistics, (SELECT @ROW := ?)r
                        WHERE user.id = statistics.user_id
                        AND NOT EXISTS (SELECT *
                                    FROM user_disabled
                                        WHERE user_disabled.user_id = statistics.user_id)
                        ORDER BY ?? DESC, ?? DESC, user.username ASC
                        LIMIT ?
                        OFFSET ?`,

    //input id
    updateStatisticsWon: `UPDATE statistics
                          SET games_played_count = games_played_count + 1,
                          games_won_count = games_won_count + 1
                          WHERE user_id = ?`,

    //input id
    updateStatisticsLost: `UPDATE statistics
                           SET games_played_count = games_played_count + 1
                           WHERE user_id = ?`,

    //tables: GAME MAP-------------------------------------------------------------------------------------------------
    //input nothing
    getAllMapsNames: "SELECT name FROM game_map",

    //input map name
    checkIfMapExists: "SELECT * FROM game_map WHERE name = ?",

    //tables: GAME MAP, COSMIC OBJECT----------------------------------------------------------------------------------
    //input game map name
    getObjectsOnMap: "SELECT * FROM cosmic_object WHERE map_id = ?",

    //tables: Admin----------------------------------------------------------------------------------
    //input game map name
    checkIfAdminExists: "SELECT * FROM admin WHERE user_id = (SELECT id FROM user WHERE username = ?)"
}
