// Owner: Nikola Jovanivic (NikolaJov96)

// Summary: Class representing game room in loading state

module.exports = function(gameRoom){
    var self = {
        room: gameRoom
    };

    self.step = function(){
        var ret = { action: null };
        return ret;
    };

    return self;
};
