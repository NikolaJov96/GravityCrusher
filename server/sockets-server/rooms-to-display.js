// Owner: Nikola Jovanovic (NikolaJov96)

// Summary: function returning array of available rooms to be forwarded to the specific user

module.exports = function(user){
    var rooms = []
    for (var i in serverState.gameRooms){
        if (serverState.gameRooms[i].joinName !== user.name) continue;
        rooms.push({
            name: serverState.gameRooms[i].name,
            host: serverState.gameRooms[i].host.name,
            map: serverState.gameRooms[i].map,
            canPlay: (serverState.gameRooms[i].join ? false : true)
        });
    }
    return rooms;
}