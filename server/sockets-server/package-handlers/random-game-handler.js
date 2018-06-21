// Owner: Nikola Jovanoivc (NikolaJov96)

// Summary: This file contains handler for joining a random game


module.exports = function(socket){ return function(data){
    logMsg('Joning random game: ' + socket.user.name);
    socket.user.interaction = true;
    
    // if player is already bind to some room return success
    var activeRoom = null;
    for (i in serverState.gameRooms){
        if (serverState.gameRooms[i].containsUserActive(socket.user)){
            activeRoom = serverState.gameRooms[i];
            break;
        }
    }
    if (activeRoom){
        socket.emit('randomGameResponse', { status: 'Success' });
        return;
    }
    
    // chose room that is waiting the longest
    var targetRoom = null;
    for (i in serverState.gameRooms) 
        if (!serverState.gameRooms[i].join && serverState.gameRooms[i].gamePublic)
            targetRoom = serverState.gameRooms[i];
    if (!targetRoom){
        socket.emit('randomGameResponse', { status: 'NoRooms' });
        return;
    }
    
    var i = targetRoom.spectators.length;
    while (i--){
        if (targetRoom.spectators[i].name === socket.user.name){
            targetRoom.spectators.splice(i, 1);
        }
    }

    socket.emit('selectGameRoomResponse', { status: 'Success' });
    targetRoom.join = socket.user;
    targetRoom.joinName = socket.user.name;
    for (var user in serverState.users){
        if (serverState.users[user].socket && serverState.users[user].page === 'GameRooms'){
            serverState.users[user].socket.emit('gameRoomsUpdate', {
                rooms: require('../rooms-to-display.js')(serverState.users[user])
            });
        }
    }
    socket.emit('randomGameResponse', { status: 'Success' });
}};
