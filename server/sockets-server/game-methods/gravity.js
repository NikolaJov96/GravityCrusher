// Owner: Andrija Cicovic (cicovic-andrija)

// Summary: Helper methods for calculations related to gravitational
//          effects on bullets.

const BULLET_MASS = 0.7;

module.exports = {

    applyGravitationalPull: function(gameState, dt){

        for (var b in gameState.bullets){

            var yVelocity = gameState.bullets[b].velocity * Math.cos(gameState.bullets[b].tilt);
            var xVelocity = gameState.bullets[b].velocity * Math.sin(gameState.bullets[b].tilt);

            for (var p in gameState.planets){
                var xDist = - gameState.planets[p].x + gameState.bullets[b].x;
                var yDist = gameState.planets[p].y - gameState.bullets[b].y;
                var distSquared = Math.pow(xDist, 2) + Math.pow(yDist, 2);
                var dist = Math.sqrt(distSquared);
                var gForce = (gameState.planets[p].Mass * BULLET_MASS) / distSquared;
                var xDistNorm = (xDist / dist);
                var yDistNorm = (yDist / dist);
                xVelocity += xDistNorm * gForce * dt;
                yVelocity += yDistNorm * gForce * dt;
            }

            gameState.bullets[b].velocity = Math.sqrt(Math.pow(xVelocity, 2) + Math.pow(yVelocity, 2));
            if (yVelocity === 0){
                gameState.bullets[b].tilt = Math.PI / 2 * ((xVelocity < 0) ? -1 : 1);
            }
            else if (yVelocity > 0){
                gameState.bullets[b].tilt =  Math.atan(xVelocity / yVelocity);
            } else {
                gameState.bullets[b].tilt =  Math.atan(xVelocity / yVelocity) + Math.PI;
            }
        }

    },

};
