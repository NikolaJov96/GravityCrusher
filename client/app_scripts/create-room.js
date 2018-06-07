// Owner: Nikola Jovanovic (NikolaJov96)

// Summary: Callbacks initialization for 'create-room' page

var roomName = document.getElementById('roomName');
var gameReachIcon = document.getElementById('gameReachIcon');
var gameReach = document.getElementById('gameReach');
var opponentDiv = document.getElementById('opponentDiv');
var opponent = document.getElementById('inputPlayer2Name');
var map = document.getElementById('map');
var roomReachIcon = document.getElementById('roomReachIcon');
var roomReach = document.getElementById('roomReach');
var submitBtn = document.getElementById('submitBtn');
var errorLabel = document.getElementById('errorLabel');

gameReach.value = 'Public Game';

initCallback = function(data){
    if (!('payload' in data)) attrMissing('payload', 'initCallback', data);
    else if (!('redirect' in data.payload)) attrMissing('redirect', 'initCallback.playload', data.payload);
    else{
        if (data.payload.redirect){
            window.location = 'game';
        }else{
            if (!('maps' in data.payload)) attrMissing('maps', 'initCallback.playload', data.payload);
            var str = '<option>Random map</option>';
            for (i in data.payload.maps){
                str += '<option>' + data.payload.maps[i].name + '</option>';
            }
            map.innerHTML = str;
            roomName.value = 'Galaxy_' + Math.round(Math.random() * 10000);
        }
    }
};
if (initCallbackData) initCallback(initCallbackData);

// send create room request
submitBtn.onclick = function(){
    errorLabel.innerHTML = '';
    if (!socket.connected){ logMsg('Server not yet connected.'); return; }
    
    if (roomName.value.length === 0){
        errorLabel.innerHTML = 'Chose the name of the room';
        logMsg('Room name field empti.');
        roomName.focus();
    }else if (opponent.value.length === 0 && gameReach.value === 'Private Game'){
        errorLabel.innerHTML = 'Chose your opponent';
        logMsg('Opponent name field empti.'); opponent.focus();
    }else{
        if (map.value === 'Random map'){
            map.options[1 + Math.floor(Math.random() * (map.length - 1))].selected = 'selected';
        }
        var createGameRoomPkg = {
            name:roomName.value,
            gamePublic:(gameReach.value === 'Public Game' ? true : false),
            opponent:opponent.value,
            gameMap:map.value,
            roomPublic:(roomReach.value === 'Public Room' ? true : false),
            chatEnabled:true
        };
        socket.emit('createGameRoom', createGameRoomPkg);
        logMsg('Game room creation requested.');
    }
    return false;
};

// toggle opponent input and lock icon
gameReach.onchange = function(){
    if (gameReach.value === 'Public Game'){
        opponentDiv.classList.add('d-none');
        gameReachIcon.innerHTML = 'lock_open';
    }else{
        opponentDiv.classList.remove('bmd-form-group');
        opponentDiv.classList.remove('d-none');
        gameReachIcon.innerHTML = 'lock_outline';
    }
}

// toggle lock icon
roomReach.onchange = function(){
    if (roomReach.value === 'Public Room'){
        roomReachIcon.innerHTML = 'lock_open';
    }else{
        roomReachIcon.innerHTML = 'lock_outline';
    }
}

socket.on('createGameRoomResponse', function(data){
    if (!('status' in data)) attrMissing('status', 'createGameRoomResponse', data);
    
    if (data.status === 'Success'){
        errorLabel.style.color = 'green';
        errorLabel.innerHTML = 'Success';
        logMsg('On createGameRoomResponse - success'); 
        window.location = 'game'; 
    }else if (data.status === 'InvalidOpponent'){
        errorLabel.innerHTML = 'Invalid opponent';
        logMsg('On createGameRoomResponse - invalid opponent');
        opponent.select();
        opponent.focus();
    }else if (data.status === 'AlreadyInGame'){
        errorLabel.innerHTML = 'Already in the game';
        logMsg('On createGameRoomResponse - user is already in the game');
    }else if (data.status === 'RoomNameTaken'){
        errorLabel.innerHTML = 'Room name is already taken';
        logMsg('On createGameRoomResponse - room name taken');
    }else if (data.status === 'MapNotFound'){
        errorLabel.innerHTML = 'Selected map is not recognized';
        logMsg('On createGameRoomResponse - map not fount in the database');
    }else logMsg('On createGameRoomResponse - unknown error: ' + data.status);
});
