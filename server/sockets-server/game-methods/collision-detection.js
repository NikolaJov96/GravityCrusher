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
    },

    bulletPlayer: function(bullet, player, gameState){
        var dim1 = gameState.playerRadius * 2.0;
        var dim2 = gameState.playerRadius;
        var x = bullet.x;
        var y = bullet.y;

        var s = Math.sin(player.tilt);
        var c = Math.cos(player.tilt);

        // translate point back to origin:
        x -= player.x;
        y -= player.y;

        // rotate point
        var newX = x * c - y * s;
        var newY = x * s + y * c;

        // check collisions
        if (newX > -dim1 && newX < dim1 && newY > -dim2 && newY < dim2) return true;
        if (newX > -dim2 && newX < dim2 && newY > -dim1 && newY < dim1) return true;
        return false;
    }

};
