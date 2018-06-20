// Owner: Nikola Jovanovic (NikolaJov96)

// Summary: Callbacks initialization for 'index' page

var randomGame = document.getElementById('randomGame');
var newRoom = document.getElementById('newRoom');

// join random game request
randomGame.onclick = function(){
    if (!socket.connected){ logMsg('Server not yet connected.'); return; }
    
    socket.emit('randomGame', {});
    logMsg('Random game join requested.');
    
    return false;
};

socket.on('randomGameResponse', function(data){
    if (!('status' in data)) attrMissing('status', 'randomGameResponse', data);
    
    if (data.status === 'Success'){
        window.location = 'game';
        logMsg('On randomGameResponse - success, joining game');
    }else if (data.status === 'NoRooms'){
        newRoom.classList.remove("d-none");
        logMsg('On randomGameResponse - there are no public games');
    }else logMsg('On randomGameResponse - unknown error: ' + data.status);
});
