// Owner: Andrija Cicovic (cicovic-andrija)

// Summary: Definition and methods for working with token cache.

var User = function(name, socket, page, isGuest, admin){
    var self = {
        name: name,
        socket: socket,
        page: page,
        isGuest: isGuest,
        admin: admin,
        interaction: true
    };

    return self;
};

var TokenCache = function(){
    var self = {
        cache: {}  // token:user map
    };

    self.cacheToken = function(token, user){ self.cache[token] = user; };
    self.invalidateToken = function(token){ if (token in self.cache) delete self.cache[token]; };
    self.containsKey = function(token){ return token in self.cache; };
    self.lookupUser = function(token){ return self.cache[token]; };
    self.updateSocket = function(token, socket){
        socket.user = self.cache[token];
        socket.user.socket = socket;
    };
    self.removeToken = function(username){
        for (token in self.cache){
            if (self.cache[token].name === username) delete self.cache[token];
        }
    }

    return self;
};

var StateObject = function(frameTime){
    var self = {
        frameTime: frameTime,
        tokenCache: TokenCache(),
        users: {},
        gameRooms: [],
        statisticsColumns: [ 'Rank', 'Username', 'Games Played', 'Games Won', 'Games Won Percentage' ],
        initStatNumber: 10,
    };

    self.addUser = function(token, username, socket, page, isGuest, admin){
        var newUser = User(username, socket, page, isGuest, admin);
        self.users[username] = newUser;
        self.tokenCache.cacheToken(token, newUser);
        socket.user = newUser;
        return newUser;
    };

    self.renameUser = function(socket, newUsername){
        if (socket.user){
            var user = self.users[socket.user.name];
            delete self.users[socket.user.name];
            socket.user.name = newUsername;
            self.users[socket.user.name] = user;
        }else{
            logMsg('No user connected to the scoket!');
        }
    };

    self.removeUser = function(token, tokensToDelete){
        var user = self.tokenCache.lookupUser(token);
        delete self.users[user.name];
        for (delToken in tokensToDelete){
            logMsg('delToken: ' + tokensToDelete[delToken]);
            logMsg(tokensToDelete);
            serverState.tokenCache.invalidateToken(tokensToDelete[delToken]);
        }
    };

    return self;
};

module.exports = StateObject;
