// Owner: Filip Mandic (mandula8)

// Summary: Class representing game room in game state

const width = 800;
const height = 600;
const MASS_TO_V = 0.5; //TODO: change constant
const radiusRandFactor = 4;
const radiusRandStart = -2;
const tiltBarrier = Math.PI * 0.5;
const PLAYER_TILT_RADIUS = width / 8.0;
const BULLET_DISP = 4;
const MAX_HEALTH = 100;
const TILT_DIFF = Math.PI / 12.0;
const TILT_COEF = Math.sin(-TILT_DIFF);
const X_DISP = width * 0.8;
const MISSILE_TYPE_BULLET = 2;
const MISSILE_TYPE_BOMB = 0;
const GAME_DURATION_MS = 1000.0 * 60 * 5;

var RoomStateGameEnd = require('./room-state-game-end.js');
var db = require('../sql-server/database-interface.js');
var collisionDetection = require('./game-methods/collision-detection.js');
var gravity = require('./game-methods/gravity.js');

var collisionCircle = collisionDetection.bulletCircle;
var boundHit = collisionDetection.bulletBoundary;
var collisionPlayer = collisionDetection.bulletPlayer;

module.exports = function(gameRoom){
    var self = {
        room: gameRoom,
        gameTimer: GAME_DURATION_MS,
        players: [ {}, {} ],
        planets: [],
        bullets: [],
        effects: [],
        width: width,
        height: height,
        time: new Date().getTime(),
        playerRadius: PLAYER_TILT_RADIUS,
        winner: '',
        gameEnd: false,
    };

    for (var i in gameRoom.planets) {
        self.planets[i] = { 
            x: gameRoom.planets[i].PositionX,
            y: gameRoom.planets[i].PositionY,
            radius: Math.floor(
                Math.pow(gameRoom.planets[i].Mass, 1.0 / 3) * 
                MASS_TO_V + Math.random() * radiusRandFactor - radiusRandStart) * width / 80.0,
            id : Math.floor(Math.random() * 15)
        }
        self.planets[i].Mass = gameRoom.planets[i].Mass;
    }

    for (var i = 0; i < 2; i++){
        self.players[i].x = (i === 0 ? X_DISP * 0.5 : width - X_DISP * 0.5);
        self.players[i].y = (i === 0 ?
                             (self.players[i].x - X_DISP) * TILT_COEF :
                             height - (width - self.players[i].x - X_DISP) * TILT_COEF);
        self.players[i].tilt = TILT_DIFF;
        self.players[i].roll = 0.0;
        self.players[i].left = false;
        self.players[i].right = false;
        self.players[i].fire = false;
        self.players[i].leftTilt = false;
        self.players[i].rightTilt = false;
        self.players[i].health = MAX_HEALTH;
        self.players[i].coolDown = 0.0;
        self.players[i].bulletCo = 0;
        self.players[i].coolDown2 = 0.0;
        self.players[i].bombCoolDown = 0.0;
    }

    logMsg('Room ' + self.room.name + ' is in game state.');

    self.initResponse = function(user){
        var ret = {
            screen: {w: width, h: height},
            state: 'game',
            role: 'spec',
            host: self.room.hostName,
            hostActive: (self.room.host.page === 'Game' ? true : false),
            join: self.room.joinName,
            joinActive: (self.room.join.page === 'Game' ? true : false),
            planets: self.planets,
            hostActive: (self.room.host.page === 'Game' ? true : false),
            joinActive: (self.room.join.page === 'Game' ? true : false),
            gameTimer: self.gameTimer,
            players: [
                {
                    x: self.players[0].x, y: self.players[0].y, tilt: self.players[0].tilt,
                    roll: self.players[0].roll, health: 1.0 * self.players[0].health / MAX_HEALTH
                },
                {
                    x: self.players[1].x, y: self.players[1].y, tilt: self.players[1].tilt,
                    roll: self.players[1].roll, health: 1.0 * self.players[1].health / MAX_HEALTH
                }
            ],
            bullets: []
        };
        if (user.name === self.room.hostName){
            ret.role = 'host';
        } else if (user.name === self.room.joinName){
            ret.role = 'join';
        }
        return ret;
    };

    self.step = function(){

        var currentTime = new Date().getTime();
        var dt = currentTime - self.time;
        self.time = currentTime;
        
        self.gameTimer -= dt;
        if (self.gameTimer < 0.0) self.gameEnd = true;

        var ret = { action: null };

        var comms = [ self.room.hostCommand, self.room.joinCommand ];
        for (var i in comms){
            if ('left' in comms[i]) self.players[i].left = comms[i].left;
            if ('right' in comms[i]) self.players[i].right = comms[i].right;
            if ('fire' in comms[i]) self.players[i].fire = comms[i].fire;
            if ('bomb' in comms[i]) self.players[i].bomb = comms[i].bomb;
            if ('leftTilt' in comms[i]) self.players[i].leftTilt = comms[i].leftTilt;
            if ('rightTilt' in comms[i]) self.players[i].rightTilt = comms[i].rightTilt;
        }

        for (var i = 0; i < 2; i++){
            if (self.players[i].left){
                self.players[i].roll += 0.00167 * dt;
                if (self.players[i].roll > 0.5) self.players[i].roll = 0.5;
                if (i === 0){
                    self.players[i].x += 0.133 * dt;
                    if (self.players[i].x > X_DISP * 0.8) self.players[i].x = X_DISP * 0.8;
                    self.players[i].y = (self.players[i].x - X_DISP) * TILT_COEF;
                } else {
                    self.players[i].x -= 0.133 * dt;
                    if (self.players[i].x < width - X_DISP * 0.8) self.players[i].x = width - X_DISP * 0.8;
                    self.players[i].y = height - (width - self.players[i].x - X_DISP) * TILT_COEF;
                }
            }
            if (self.players[i].right){
                self.players[i].roll -= 0.00167 * dt;
                if (self.players[i].roll < -0.5) self.players[i].roll = -0.5;
                if (i === 0){
                    self.players[i].x -= 0.133 * dt;
                    if (self.players[i].x < 0.04 * width) self.players[i].x = 0.04 * width;
                    self.players[i].y = (self.players[i].x - X_DISP) * TILT_COEF;
                } else {
                    self.players[i].x += 0.133 * dt;
                    if (self.players[i].x > width * 0.96) self.players[i].x = width * 0.96;
                    self.players[i].y = height - (width - self.players[i].x - X_DISP) * TILT_COEF;
                }
            }
            if (!self.players[i].left && !self.players[i].right){
                if (self.players[i].roll < -0.00167 * dt) self.players[i].roll += 0.00167 * dt;
                else if (self.players[i].roll > 0.00167 * dt) self.players[i].roll -= 0.00167 * dt;
            }

            if (self.players[i].leftTilt){
                self.players[i].tilt += 0.0013 * dt;
                if (self.players[i].tilt > tiltBarrier + TILT_DIFF) self.players[i].tilt = tiltBarrier + TILT_DIFF;
            }
            if (self.players[i].rightTilt){
                self.players[i].tilt -= 0.0013 * dt;
                if (self.players[i].tilt < -tiltBarrier + TILT_DIFF) self.players[i].tilt = -tiltBarrier + TILT_DIFF;
            }

            if (self.players[i].fire){
                if (self.players[i].coolDown2 < currentTime){
                    if (self.players[i].coolDown < currentTime){
                        self.players[i].coolDown = currentTime + 100;
                        self.players[i].bulletCo++;
                        var factor = (i === 0) ? -1 : 1;
                        self.bullets.push({
                            x: self.players[i].x - PLAYER_TILT_RADIUS * factor * Math.sin(self.players[i].tilt),
                            y: self.players[i].y - PLAYER_TILT_RADIUS * factor * Math.cos(self.players[i].tilt),
                            tilt: factor * self.players[i].tilt * ((i === 0) ? 1 : -0.5) + Math.PI * (1 + factor) / 2.0,
                            // id: Math.floor(Math.random() * 4),
                            id: MISSILE_TYPE_BULLET,
                            radius: width / 100.0,
                            velocity: 0.3,
                        });
                        if (self.players[i].bulletCo === 10){
                            self.players[i].coolDown2 = currentTime + 2000;
                            self.players[i].bulletCo = 0;
                        }
                    }
                }
            }

            if (self.players[i].bomb){
                if (self.players[i].bombCoolDown < currentTime){
                    self.players[i].bombCoolDown = currentTime + 4000;
                    var factor = (i === 0) ? -1 : 1;
                    self.bullets.push({
                        x: self.players[i].x - PLAYER_TILT_RADIUS * factor * Math.sin(self.players[i].tilt),
                        y: self.players[i].y - PLAYER_TILT_RADIUS * factor * Math.cos(self.players[i].tilt),
                        tilt: factor * self.players[i].tilt * ((i === 0) ? 1 : -0.5) + Math.PI * (1 + factor) / 2.0,
                        id: MISSILE_TYPE_BOMB,
                        radius: width / 100.0,
                        velocity: 0.25,
                    });
                }
            }
        }

        //TODO: state update, bullet movement and collision detection between bullets and players,
        // planets, screen boundary or other bullets
        gravity.applyGravitationalPull(self, dt);

        for (var i in self.bullets) {
            self.bullets[i].x += -Math.sin(self.bullets[i].tilt) * self.bullets[i].velocity * dt;
            self.bullets[i].y +=  Math.cos(self.bullets[i].tilt) * self.bullets[i].velocity * dt;
        }

        var i = self.bullets.length;
        while(i--) {
            if (boundHit(self.bullets[i], self)) {
                self.bullets.splice(i, 1);
                continue;
            }

            if (collisionPlayer(self.bullets[i], self.players[0], self)){
                var effect = { x: self.bullets[i].x, y: self.bullets[i].y, tilt: Math.random() * Math.PI * 2.0 };
                if (self.bullets[i].id === MISSILE_TYPE_BULLET){
                    self.players[0].health -= 1;
                    effect.timeout = 250;
                } else {
                    self.players[0].health -= MAX_HEALTH * 0.75;
                    effect.timeout = 1000;
                }
                self.effects.push(effect);
                self.bullets.splice(i, 1);
                if (self.players[0].health <= 0) {
                    self.winner = 'join';
                    self.gameEnd = true;
                    logMsg("Join won");
                }
                continue;
            }

            if (collisionPlayer(self.bullets[i], self.players[1], self)){
                var effect = { x: self.bullets[i].x, y: self.bullets[i].y, tilt: Math.random() * Math.PI * 2.0 };
                if (self.bullets[i].id === MISSILE_TYPE_BULLET){
                    self.players[1].health -= 1;
                    effect.timeout = 250;
                } else {
                    self.players[1].health -= MAX_HEALTH * 0.75;
                    effect.timeout = 1000;
                }
                self.effects.push(effect);
                self.bullets.splice(i, 1);
                if (self.players[1].health <= 0) {
                    self.winner = 'host';
                    self.gameEnd = true;
                    logMsg("Host won");
                }
                continue;
            }


            var j = self.planets.length;
            var doContinue = false;
            while(j--) {
                if (collisionCircle(self.bullets[i], self.planets[j])) {
                    self.effects.push({ 
                        x: self.bullets[i].x, y: self.bullets[i].y, tilt: Math.random() * Math.PI * 2.0, timeout: 200
                    });
                    self.bullets.splice(i, 1);
                    doContinue = true;
                    break;
                }
            }
            if (doContinue) continue;

            j = self.bullets.length;
            while(j--) {
                if ((i !== j) && (collisionCircle(self.bullets[i], self.bullets[j]))) {
                    self.effects.push({ 
                        x: self.bullets[i].x, y: self.bullets[i].y, tilt: Math.random() * Math.PI * 2.0, timeout: 200
                    });
                    self.bullets.splice(i, 1);
                    self.bullets.splice(j, 1);
                    if (j < i) i--;
                    break;
                }
            }
        }
        
        i = self.effects.length;
        while(i--) {
            self.effects[i].timeout -= dt;
            if (self.effects[i].timeout < 0.0) {
                self.effects.splice(i, 1);
            }
        }

        // updating players and spectators on the new game state
        var gameState = {
            hostActive: (self.room.host.page === 'Game' ? true : false),
            joinActive: (self.room.join.page === 'Game' ? true : false),
            players: [
                {
                    x: self.players[0].x, y: self.players[0].y, tilt: self.players[0].tilt,
                    roll: self.players[0].roll, health: 1.0 * self.players[0].health / MAX_HEALTH
                },
                {
                    x: self.players[1].x, y: self.players[1].y, tilt: self.players[1].tilt,
                    roll: self.players[1].roll, health: 1.0 * self.players[1].health / MAX_HEALTH
                }
            ],
            bullets: self.bullets,
            effects: self.effects.map(e => { return {
                x: e.x, y: e.y, tilt: e.tilt, radius: e.timeout / 1000.0 * width / 400.0 
            };})
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
        if (self.gameEnd){
            if (!self.room.host.isGuest){
                if (self.winner === 'host') db.insertStatisticsForPlayer(self.room.hostName, "Won", null);
                else db.insertStatisticsForPlayer(self.room.hostName, "Lost", null);
            }
            if (!self.room.join.isGuest){
                if (self.winner === 'join') db.insertStatisticsForPlayer(self.room.joinName, "Won", null);
                else db.insertStatisticsForPlayer(self.room.joinName, "Lost", null);
            }
            self.room.winner = self.winner;
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
