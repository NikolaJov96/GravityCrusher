// Owner: Andrija Cicovic (cicovic-andrija)

// Summary: Helper methods for calculations related to gravitational
//          effects on bullets.

const BULLET_MASS = 0.01;

module.exports = {

    applyGravitationalPull: function(gameState, dt){

        for (var bullet in gameState.bullets){

            var yVelocity = bullet.velocity * Math.sin(bullet.tilt);
            var xVelocity = bullet.velocity * Math.cos(bullet.tilt);

            for (var planet in gameState.planets){
                var xDist = planet.x - bullet.x;
                var yDist = planet.y - bullet.y;
                var distSquared = Math.pow(xDist, 2) + Math.pow(yDist, 2);
                var dist = Math.sqrt(distSquared);
                var gForce = (planet.Mass * BULLET_MASS) / distSquared;
                var xDistNorm = (xDist / dist) * gForce * dt;
                var yDistNorm = (yDist / dist) * gForce * dt;
                xVelocity += xDistNorm;
                yVelocity += yDistNorm;
            }

            bullet.velocity = Math.sqrt(Math.pow(xVelocity, 2) + Math.pow(yVelocity, 2));
            bullet.tilt = Math.asin(yVelocity);

        }

    },

};