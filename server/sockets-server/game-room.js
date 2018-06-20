// Owner: Nikola Jovanivic (NikolaJov96)

// Summary: Class representing one game room

var RoomStateLoading = require('./room-state-loading.js');

module.exports = function(name, host, gamePublic, joinName, map, roomPublic, chatEnabled, planets){
    var self = {
        name: name,
        host: host,
        gamePublic: gamePublic,
        joinName: joinName,
        map: map,
        roomPublic: roomPublic,
        chatEnabled: chatEnabled,
        hostName: host.name,
        join: null,
        spectators: [],
        messages: [],
        newMessages: [],
        hostCommand: {},
        joinCommand: {},
        winner: '',
        planets: planets
    };
    self.state = RoomStateLoading(self);

    self.step = function(){
        var ret = self.state.step();
        
        if (ret.action === 'rematch'){
            ret.action = 'nextState';
            ret.nextState = RoomStateLoading;
            self.winner = '';
        }
        
        if (ret.action === 'nextState'){
            self.state = ret.nextState(self);
            if (self.host.socket && self.host.page === 'Game')
                self.host.socket.emit('initRoomState', self.state.initResponse(self.host));
            if (self.join.socket && self.join.page === 'Game')
                self.join.socket.emit('initRoomState', self.state.initResponse(self.join));
            for (i in self.spectators){
                if (self.spectators[i].socket && self.spectators[i].page === 'Game'){
                    self.spectators[i].socket.emit('initRoomState', self.state.initResponse(self.spectators[i]));
                }
            }
        }
        else if (ret.action === 'gameFinished') return true;  // remove game room

        self.hostCommand = {};
        self.joinCommand = {};

        var msgArr = [];
        for (var i in self.newMessages){
            self.messages.push(self.newMessages[i]);
            msgArr.push(self.newMessages[i]);
        }
        self.newMessages = [];
        if (msgArr.length > 0){
            if (self.host && self.host.socket && self.host.page === 'Game') self.host.socket.emit('broadcastResponse', { msgArr: msgArr });
            if (self.join && self.join.socket && self.join.page === 'Game') self.join.socket.emit('broadcastResponse', { msgArr: msgArr });
            for (i in self.spectators){
                if (self.spectators[i].socket && self.spectators[i].page === 'Game')
                    self.spectators[i].socket.emit('broadcastResponse', { msgArr: msgArr });
            }
        }

        return false;  // game room is stil active
    };

    self.containsUserBind = function(user){
        if (user.name === self.hostName) return true;
        if (user.name === self.joinName) return true;
        return false;
    };

    self.containsUserActive = function(user){
        if (self.host && user.name === self.hostName) return true;
        if (self.join && user.name === self.joinName) return true;
        return false;
    };

    return self;
};
