// Owner: Filip Mandic (mandula8)

// Summary: This file contains handler that handles requests for banning user

var db = require('../../sql-server/database-interface.js');

//TODO: different bann periods

const SMALL_BANN = 0;
const MEDIUM_BANN = 1;
const SERIOUS_BANN = 2;

const SMALL_BANN_PERIODS = 3600000; //hour in milis
const MEDIUM_BANN_PERIOD = 1; //day
const SERIOUS_BANN_PERIOD = 14; //days

module.exports = function(socket){ return function(data){
    logMsg('Bann user req: Data: ');
    logMsg(data);
    socket.user.interaction = true;

    var bannToDate = new Date();

    if (data.level === SMALL_BANN) bannToDate.setTime(bannToDate.getTime() + SMALL_BANN_PERIODS);
    else if (data.level === MEDIUM_BANN) bannToDate.setDate(bannToDate.getDate() + MEDIUM_BANN_PERIOD);
    else if (data.level === SERIOUS_BANN) bannToDate.setDate(bannToDate.getDate() + SERIOUS_BANN_PERIOD);
    else return;

    if (socket.user.admin) {
        db.bannUser(data.username, bannToDate, function(socket, data) { return function(status, bannDate) {

                socket.emit('bannUserResponse', { status: status});

                if (status === 'Success') {
                    if (data.username in serverState.users){
                        serverState.users[data.username].socket.emit('signOutResponse',
                                                     {'status':'Success', 'deactivated':false});
                    }
                }

            }
        }(socket, data));
    }
}};
