// Owner: Nikola Jovanovic (NikolaJov96)

// Summary: Helper methods for collision detection between
//          bullet adn planet or bullet and screen boundary

module.exports = {
    
    bullet_planet: function(bullet, planet){
        var distSqared = Math.pow(planet.x - bullet.x, 2) + Math.pow(planet.y - bullet.y, 2);
        var maxDistSqared = Math.pow(planet.radius + bullet.radius, 2);
        if (distSqared <= maxDistSqared) return true;
        return false;
    },

    bullet_boundary: function(bullet){
        if (bullet.x < 0) return true;
        if (bullet.y < 0) return true;
        if (bullet.x > width) return true;
        if (bullet.y > height) return true;
        return false;
    }
    
};
