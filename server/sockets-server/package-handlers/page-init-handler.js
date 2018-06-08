// Owner: Andrija Cicovic (cicovic-andrija)

// Summary: Handler definitions for page initialization requests.

var db = require('../../sql-server/database-interface.js');
var fs = require('fs');

module.exports = function(socket){ return function(data) {
    var genTempUser = function(socket, page, response){
        // user name is equal to the token
        var token = require('uuid/v1')(); // generates an unique string
        response.token = token;
        var name;
        do{ name = 'Guest_' + Math.round(Math.random() * 10000); }while(name in serverState.users);
        var newUser = serverState.addUser(token, name, socket, page, true, false);
        return newUser;
    };
    
    var genAvatar = function(data, user, response){
        db.getAvatar(user.name, function(status, filename){
            if (status === 'Success'){
                fs.readFile('server/sockets-server/avatars/' + filename + '.png', function(err, content){
                    if (!err){ response.avatarFile = content.toString('base64'); }
                    genPayload(data, user, response);
                });
                return;
            }
            genPayload(data, user, response);
        });
    };

    var genPayload = function(data, user, response){
        if (data.page === 'Game'){
            response.payload = { redirect: true };
            for (var i in serverState.gameRooms){
                if (serverState.gameRooms[i].containsUserBind(user)){
                    if (serverState.gameRooms[i].joinName === user.name) serverState.gameRooms[i].join = user;
                    else if (serverState.gameRooms[i].hostName === user.name) serverState.gameRooms[i].host = user;
                    response.payload = serverState.gameRooms[i].state.initResponse(user);
                    response.payload.messages = serverState.gameRooms[i].messages;
                    logMsg('    page: Game, play');
                    break;
                } else {
                    var specFound = false;
                    for (j in serverState.gameRooms[i].spectators){
                        if (serverState.gameRooms[i].spectators[j].name === user.name){
                            specFound = true;
                            break;
                        }
                    }
                    if (specFound){
                        response.payload = serverState.gameRooms[i].state.initResponse(user);
                        response.payload.messages = serverState.gameRooms[i].messages;
                        logMsg('    page: Game, spectate');
                    }
                }
            }
        } else if (data.page === 'GameRooms'){
            var room = null;
            for (var i in serverState.gameRooms){
                if (serverState.gameRooms[i].containsUserActive(user)){
                    room = serverState.gameRooms[i];
                    break;
                }
            }
            if (room){
                logMsg('    page: GameRooms, redirect to the game');
                response.payload = { redirect: true };
            } else {
                logMsg('    page: GameRooms');
                response.payload = { redirect: false, rooms: require('../rooms-to-display.js')(user) };
            }
        } else if (data.page === 'CreateRoom'){
            var room = null;
            for (var i in serverState.gameRooms){
                if (serverState.gameRooms[i].containsUserActive(user)){
                    room = serverState.gameRooms[i];
                    break;
                }
            }
            if (room){
                logMsg('    page: CreateRoom, redirect to the game');
                response.payload = { redirect: true };
            } else {
                var rooms = db.selectGameMaps(function(status, maps){
                    response.payload = { redirect: false, maps: maps };
                    socket.emit('pageInitResponse', response);
                });
                return;
            }
        } else if (data.page === 'Statistics'){
            var res = db.getStatisticsForPosition('Games Won', serverState.initStatNumber, 0,
                function(status, table, maxRow) {
                    response.payload = {
                        metrics: serverState.statisticsColumns,
                        default: 'Games Won',
                        data: table,
                        maxRow: maxRow
                    };
                    logMsg('    page: Statistics');
                    socket.emit('pageInitResponse', response);
                });
            return;
        }
        socket.emit('pageInitResponse', response);
    };

    logMsg('Page init. req: TOKEN:' + data.token + ' page: ' + data.page);
    if (socket.user) socket.user.interaction = true;

    var response = {
        'status': null,
        'signedIn': false,
        'username': null,
        'debugMode': debugMode,
        'avatarFile': null,
        'admin': false
    };

    if (!('token' in data) || data.token === ''){
        // gen temp guest user
        user = genTempUser(socket, data.page, response);
        response.status = 'Success';
        logMsg('Init handler, new temp user, name: ' + user.name);
        genPayload(data, user, response);
    } else {
        logMsg('token: ' + data.token)
        if (serverState.tokenCache.containsKey(data.token)){
            serverState.tokenCache.updateSocket(data.token, socket);
            serverState.tokenCache.lookupUser(data.token).page = data.page;
            var user = serverState.tokenCache.lookupUser(data.token);
            response.status = 'Success';
            logMsg('Init handler, cache token match, user ' + user.name);
            if (!user.isGuest){
                response.username = user.name;
                response.signedIn = true;
                response.admin = user.admin;
                genAvatar(data, user, response);
            } else {
                response.token = data.token;
                genPayload(data, user, response);
            }
        } else {
            db.getUsernameByToken(data.token,
                function(status, username, admin){
                    var user = null;
                    if (status === 'Success'){
                        response.status = status;
                        response.username = username;
                        response.signedIn = true;
                        response.admin = admin;
                        user = serverState.addUser(data.token, username, socket, data.page, false, admin);
                        logMsg('Init handler, db token match, user ' + user.name);
                        genAvatar(data, user, response);
                    } else {
                        // gen temp guest user
                        user = genTempUser(socket, data.page, response);
                        response.status = 'Success';
                        logMsg('Init handler, new temp user, token: ' + user.name);
                        genPayload(data, user, response);
                    }
                }
            );
        }
    }

};};
