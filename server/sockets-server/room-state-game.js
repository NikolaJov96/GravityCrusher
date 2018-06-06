// Owner: Filip Mandic (mandula8)

// Summary: Class representing game room in game state

var RoomStateGameEnd = require('./room-state-game-end.js');
var db = require('../sql-server/database-interface.js');

const width = 4;
const height = 3;

module.exports = function(gameRoom){
    var self = {
        room: gameRoom,
        counter: 3 * 60 * 1000 / serverState.frameTime,
        players: [ {}, {} ],
        planets: [],
        bullets: [],
    };

    for (var i = 0; i < 2; i++){
        self.players[i].x = (i === 0 ? 0 : width);
        self.players[i].y = (i === 0 ? 0 : height);
        self.players[i].tilt = 0.0;
        self.players[i].roll = 0.0;
        self.players[i].left = false;
        self.players[i].right = false;
        self.players[i].fire = false;
        self.players[i].leftTilt = false;
        self.players[i].rightTilt = false;
        self.players[i].health = 100;
    }

    logMsg('Room ' + self.room.name + ' is in game state.');

    self.initResponse = function(user){
        // TODO -- treba poslati i sve slike zajedno sa ovim podacima
        var ret = {
            screen: {w: width, h: height},
            state: 'game',
            role: 'spec',
            host: self.room.hostName,
            hostActive: (self.room.host.page === 'Game' ? true : false),
            join: self.room.joinName,
            joinActive: (self.room.join.page === 'Game' ? true : false),
            playerData: self.players,
            planetData: self.planets,
            bulletData: self.bullets,
        };
        if (user.name === self.room.hostName){
            ret.role = 'host';
        } else if (user.name === self.room.joinName){
            ret.role = 'join';
        }
        return ret;
    };

    self.step = function(){
        var ret = { action: null };

        var comms = [ self.room.hostCommand, self.room.joinCommand ];
        for (var i in comms){
            if ('left' in comms[i]) self.players[i].left = comms[i].left;
            if ('right' in comms[i]) self.players[i].right = comms[i].right;
            if ('fire' in comms[i]) self.players[i].fire = comms[i].fire;
            if ('leftTilt' in comms[i]) self.players[i].leftTilt = comms[i].leftTilt;
            if ('rightTilt' in comms[i]) self.players[i].rightTilt = comms[i].rightTilt;
        }

        // TODO: adjust to the new commands
        for (var i = 0; i < 2; i++){
            if (self.players[i].left){

            }
            if (self.players[i].right){

            }
            if (self.players[i].fire){

            }
            if (self.players[i].leftTilt){

            }
            if (self.players[i].rightTilt){

            }
        }
        // for (var i = 0; i < 2; i++){
        //     if (self.players[i].arrLeft){
        //         self.players[i].roll += 0.015;
        //         if (self.players[i].roll > 0.5) self.players[i].roll = 0.5;
        //     }
        //     if (self.players[i].arrUp) {
        //         self.players[i].x += 5 * Math.cos(self.players[i].rotation);
        //         self.players[i].y += 5 * Math.sin(self.players[i].rotation);
        //     }
        //     if (self.players[i].arrRight){
        //         self.players[i].roll -= 0.015;
        //         if (self.players[i].roll < -0.5) self.players[i].roll = -0.5;
        //     }
        //     if (!self.players[i].arrLeft && !self.players[i].arrRight){
        //         if (self.players[i].roll < 0) self.players[i].roll += 0.015;
        //         else if (self.players[i].roll > 0) self.players[i].roll -= 0.015;
        //     }
        //     self.players[i].rotation =
        //         (self.players[i].rotation - self.players[i].roll / 10.0 + 2 * Math.PI) % (2 * Math.PI);
        // }
        // ENDTODO

        var gameState = {
            hostActive: (self.room.host.page === 'Game' ? true : false),
            joinActive: (self.room.join.page === 'Game' ? true : false),
            counter: self.counter * serverState.frameTime / 1000,
            playerData: self.players,
            bulletData: self.bullets,
        };
        if (self.room.host.socket && self.room.host.page === 'Game'){
            self.room.host.socket.emit('gameState', gameState);
        }
        if (self.room.join.socket && self.room.join.page === 'Game'){
            self.room.join.socket.emit('gameState', gameState);
        }
        for (i in self.room.spectators){
            if (self.room.spectators[i].socket && self.room.spectators[i].page === 'Game'){
                self.room.spectators[i].socket.emit('gameState', gameState);
            }
        }

        // TODO: different end game logic
        if (false){
            if (!self.room.host.isGuest) db.insertStatisticsForPlayer(self.room.hostName, "Won", null);
            if (!self.room.join.isGuest) db.insertStatisticsForPlayer(self.room.joinName, "Lost", null);
            self.room.winner = 'host';
            ret.action = 'nextState';
            logMsg('Room ' + self.room.name + ' game state finished.');
        } else {
            if ('surrender' in self.room.hostCommand && self.room.hostCommand.surrender){
                if (!self.room.host.isGuest) db.insertStatisticsForPlayer(self.room.hostName, "Lost", null);
                if (!self.room.join.isGuest) db.insertStatisticsForPlayer(self.room.joinName, "Won", null);
                self.room.winner = 'join';
                ret.action = 'nextState';
                logMsg('Room ' + self.room.name + ' game state finished, host surrendered.');
            } else if ('surrender' in self.room.joinCommand && self.room.joinCommand.surrender){
                if (!self.room.host.isGuest) db.insertStatisticsForPlayer(self.room.hostName, "Won", null);
                if (!self.room.join.isGuest) db.insertStatisticsForPlayer(self.room.joinName, "Lost", null);
                self.room.winner = 'host';
                ret.action = 'nextState';
                logMsg('Room ' + self.room.name + ' game state finished, join surrendered.');
            }
        }

        if (ret.action === 'nextState'){
            ret.nextState = RoomStateGameEnd;
            self.room.roomPublic = false;
            for (var user in serverState.users){
                if (serverState.users[user].socket && serverState.users[user].page === 'GameRooms'){
                    serverState.users[user].socket.emit('gameRoomsUpdate', {
                        rooms: require('./rooms-to-display.js')(serverState.users[user])
                    });
                }
            }
        }

        return ret;
    };

    return self;
};

