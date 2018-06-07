// Owner: Nikola Jovanovic (NikolaJov96)

// Summary: Helper methods for collision detection between
//          bullet and circle or bullet and screen boundary

module.exports = {

    bulletCircle: function(bullet, circle){
        var distSqared = Math.pow(circle.x - bullet.x, 2) + Math.pow(circle.y - bullet.y, 2);
        var maxDistSqared = Math.pow(circle.radius + bullet.radius, 2);
        if (distSqared <= maxDistSqared) return true;
        return false;
    },

    bulletBoundary: function(bullet, gameState){
        if (bullet.x < 0) return true;
        if (bullet.y < 0) return true;
        if (bullet.x > gameState.width) return true;
        if (bullet.y > gameState.height) return true;
        return false;
    }

};
