// author: Nikola Jovanovic (NikolaJov96)

// init socket object
var socket = io('localhost:8001');
// define plyer's turn
var player = -1;
// get UI elements
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
ctx.font = '60px Arial';

// draw game state
var draw = function(state){
	// draw X or O for player
	console.log('state (player: ' + (player === 0 ? 'X' : 'O') + '):');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillText('player: ' + (player === 0 ? 'X' : 'O'), 100, 100);
	
	// draw table to console
	var out = [];
	out.push('-------\n');
	for (var i = 2; i >= 0; i--){
		out.push('|')
		for (var j = 0; j < 3; j++){
			if (state[i * 3 + j] === -1) out.push(' |');
			else if (state[i * 3 + j] === 0) out.push('X|');
			else out.push('O|');
		}
		out.push('\n-------\n');
	}
	console.log(out.join(''));
	
	// draw table to canvas
	for (var i = 2; i >= 0; i--){
		ctx.fillText('|', 100, 100 + (3 - i) * 100)
		for (var j = 0; j < 3; j++){
			if (state[i * 3 + j] === -1) 
				ctx.fillText(' ', (j + 1.4) * 100, 100 + (3 - i) * 100);
			else if (state[i * 3 + j] === 0) 
				ctx.fillText('X', (j + 1.4) * 100, 100 + (3 - i) * 100);
			else  
				ctx.fillText('O', (j + 1.4) * 100, 100 + (3 - i) * 100);
			ctx.fillText('|', (j + 2) * 100, 100 + (3 - i) * 100);
		}
	}
}

// initial package with information about player's turn
socket.on('init', function(data){
	player = data.player;
	draw(data.state);
});

// redraw table when update is recieved 
// (data from request is forwarded to the draw function)
socket.on('update', draw);

// announce the winner when that information is received
socket.on('winner', function(winner){
	var message = '';
	if (winner === 2) message = 'Draw!';
	else if (winner === player) message = 'Victory!';
	else message = 'Lost!';
	
	console.log(message + '(refresh to restart)');
	ctx.fillText(message, 700, 300);
	ctx.fillText('(refresh to restart)', 600, 400);
});

// forward user command to the server (press on the num-pad)
document.onkeydown = function(event){
	var key = event.keyCode - 48;
	if (key < 1 || key > 9) key = event.keyCode - 96;
	if (key >= 1 && key <= 9) socket.emit('move', {
		move:key - 1
	});
}
