// author: Nikola Jovanovic (NikolaJov96)

// init http server
var serv = require('http').createServer(function(req, res){});
// init socket.io listerer on the server
var io = require('socket.io')(serv);
var SOCKET_PORT = 8001;

// list of all open connections
var SOCKET_LIST = {};

// Game class
var Game = function(soc){
	self = {
		id:Math.random(),
		state:[],
		socket:soc,
		player:0,
		move:-1,
		ended:false
	}
	// init state
	for (var i = 0; i < 9; i++) self.state.push(-1);
	// random player
	if (Math.random() < 0.5) self.player++;
	
	// play random CPU move
	self.playRandom = function(player){
		var free = [];
		for (var i = 0; i < 9; i++) if (self.state[i] === -1) free.push(i);
		self.state[free[Math.floor(Math.random() * free.length)]] = player;
	}
	// check win/loss/draw/none
	self.winner = function(){
		for (var i = 0; i < 3; i++)
			if (self.state[3*i] === self.state[3*i + 1] && 
				self.state[3*i] === self.state[3*i + 2]) return self.state[3*i];
		for (var i = 0; i < 3; i++)
			if (self.state[i] === self.state[i + 3] && 
				self.state[i] === self.state[i + 6]) return self.state[i];
		if (self.state[0] === self.state[4] && 
			self.state[0] === self.state[8]) return self.state[0];
		if (self.state[2] === self.state[4] && 
			self.state[2] === self.state[6]) return self.state[2];
		// not ended
		for (var i = 0; i < 9; i++) if (self.state[i] === -1) return -1;
		// draw
		return 2;
	}
	// add itself to the static list of all games
	Game.list[self.id] = self;
	return self;
}
Game.list = {}

// on new connection
io.on('connection', function(socket){
	console.log('New connection.');
	
	// init new game
	var game = Game(socket);
	SOCKET_LIST[socket] = game.id;
	if (game.player != 0) game.playRandom(0);
	// send init state with player's turn
	game.socket.emit('init', {
		state:game.state,
		player:game.player
	});
	
	// on received move
	socket.on('move', function(data){
		game.move = data.move;
	});
	
	socket.on('disconnect', function(){
		console.log('Disconnected');
		delete Game.list[SOCKET_LIST[socket]];
		delete SOCKET_LIST[socket];
	});
});

setInterval(function(){
	// loop through all games
	for (var id in Game.list){
		var game = Game.list[id];
		// next move received and valid, and game not over
		if (game.move >= 0 && game.move <= 8 &&
			game.state[game.move] === -1 &&
			!game.ended){
			// apply player's command
			game.state[game.move] = game.player;
			// check for game end
			var winner = game.winner();
			if (winner !== -1){
				game.socket.emit('update', game.state);
				console.log('End: ' + winner);
				game.socket.emit('winner', winner);
				game.ended = true;
			}
			if (winner === -1){
				// if not game ended, play CPU move
				game.playRandom((game.player + 1) % 2);
				game.socket.emit('update', game.state);
				winner = game.winner();
				if (winner !== -1){
					console.log('End: ' + winner);
					game.socket.emit('winner', winner);
					game.ended = true;
				}
			}
		}
		game.move = -1;
	}
}, 40);

serv.listen(SOCKET_PORT);

console.log('Socket server listetning on port: ' + SOCKET_PORT + '.');
