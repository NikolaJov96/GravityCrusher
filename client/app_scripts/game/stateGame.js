// Owner: Nikola Jovanovic (NikolaJov96)

// Summary: State class representing loading roomState

StateGame = function(data){
    // state initialization
    console.log('current state: game - move using w a s d');
    self = abstractState();
    self.role = data.role;
    self.hostName = data.host;
    self.joinName = data.join;
    self.planets = [];
    self.prop = {
        w: screen.w / data.screen.w,
        h: screen.h / data.screen.h
    };
    for (var i in data.planets){
        var newPlanet = {};
        newPlanet.translation = [
            (self.role !== 'join' ? screen.w - data.planets[i].x * self.prop.w : data.planets[i].x * self.prop.w), 
            (self.role !== 'join' ? screen.h - data.planets[i].y * self.prop.h : data.planets[i].y * self.prop.h), 
            0.0
        ];
        newPlanet.radius = data.planets[i].radius;
        newPlanet.id = data.planets[i].id;
        self.planets.push(newPlanet);
    }
    self.hostActive = data.hostActive;
    self.joinActive = data.joinActive;
    self.players = [ {}, {} ];
    for (var i = 0; i < 2; i++){
        for (var i = 0; i < 2; i++){
            self.players[i].translation = [
                (self.role !== 'join' ? screen.w - data.players[i].x * self.prop.w : data.players[i].x * self.prop.w),
                (self.role !== 'join' ? screen.h - data.players[i].y * self.prop.h : data.players[i].y * self.prop.h),
                0.0
            ];
            self.players[i].rotation = -data.players[i].tilt;
            self.players[i].roll = data.players[i].roll;
            self.players[i].health = data.players[i].health;
        }
        if (self.role !== 'join') self.players[0].rotation = (self.players[0].rotation + Math.PI) % (Math.PI * 2.0);
        else self.players[1].rotation = (self.players[1].rotation + Math.PI) % (Math.PI * 2.0);
    }
    self.bullets = [];
    self.stars = [];
    for (var i = 0; i < 10; i++){
        self.stars.push({
            translation: [Math.random() * screen.w, Math.random() * screen.h, -20.0],
            rotation: Math.random() * Math.PI * 2.0,
            id: Math.floor(Math.random() * 3)
        });
    }
    
    self.pressed = [false, false, false, false, false];
    self.surrender = false;
    
    self.createObject('white', 'spaceBody', 'white');
    self.createObject('green', 'spaceBody', 'green');
    self.createObject('red',   'spaceBody', 'red'  );
    
    // add all taxtures
    self.createObject('m0', 'spaceBody', 'missles/missle-blue');
    self.createObject('m1', 'spaceBody', 'missles/missle-green');
    self.createObject('m2', 'spaceBody', 'missles/missle-red');
    self.createObject('m3', 'spaceBody', 'missles/missle-yellow');
    
    self.createObject('p0', 'spaceBody', 'planets/planet-1');
    self.createObject('p1', 'spaceBody', 'planets/planet-2');
    self.createObject('p2', 'spaceBody', 'planets/planet-3');
    self.createObject('p3', 'spaceBody', 'planets/planet-4');
    self.createObject('p4', 'spaceBody', 'planets/planet-5');
    self.createObject('p5', 'spaceBody', 'planets/planet-6');
    self.createObject('p6', 'spaceBody', 'planets/planet-7');
    self.createObject('p7', 'spaceBody', 'planets/planet-8');
    self.createObject('p8', 'spaceBody', 'planets/planet-9');
    self.createObject('p9', 'spaceBody', 'planets/planet-10');
    self.createObject('p10', 'spaceBody', 'planets/planet-11');
    self.createObject('p11', 'spaceBody', 'planets/planet-12');
    self.createObject('p12', 'spaceBody', 'planets/planet-13');
    self.createObject('p13', 'spaceBody', 'planets/planet-14');
    self.createObject('p14', 'spaceBody', 'planets/planet-15');
    self.createObject('p15', 'spaceBody', 'planets/planet-16');
    
    self.createObject('rd0', 'ship', 'ships/dark-blue-rocket');
    self.createObject('rd1', 'ship', 'ships/dark-green-rocket');
    self.createObject('rd2', 'ship', 'ships/dark-red-rocket');
    self.createObject('rd3', 'ship', 'ships/dark-yellow-rocket');
    self.createObject('r0', 'ship', 'ships/blue-rocket');
    self.createObject('r1', 'ship', 'ships/green-rocket');
    self.createObject('r2', 'ship', 'ships/red-rocket');
    self.createObject('r3', 'ship', 'ships/yellow-rocket');
    
    self.createObject('sw0', 'spaceBody', 'stars/star-1-w');
    self.createObject('sw1', 'spaceBody', 'stars/star-2-w');
    self.createObject('sw2', 'spaceBody', 'stars/star-3-w');
    self.createObject('sy0', 'spaceBody', 'stars/star-1-y');
    self.createObject('sy1', 'spaceBody', 'stars/star-2-y');
    self.createObject('sy2', 'spaceBody', 'stars/star-3-y');
    
    // UI update
    if (self.role !== 'spec'){
        surrenderBtn.innerHTML = 'surrender';
        surrenderBtn.onclick = function(){
            self.surrender = true;
            return false;
        };
    }
    
    // init projection and view matrices used throughout this roomState
    mat4.ortho(self.projMatrix, -screen.w / 2.0, screen.w / 2.0, 
               screen.h / 2.0, -screen.h / 2.0, 0, 1000);
    mat4.lookAt(self.viewMatrix, [screen.w / 2.0, screen.h / 2.0, 200], 
                [screen.w / 2.0, screen.h / 2.0, 0], [0, 1, 0]);
    self.lightSource = new Float32Array([screen.w / 2.0, screen.h / 2.0, 10]);
    self.lightSource[2] = 40.0;
    self.ambientColor = new Float32Array([0.6, 0.6, 0.6]);
    self.directedColor = new Float32Array([0.9, 0.9, 0.9]);
    
    self.handleStatePackage = function(data){
        if (!('hostActive' in data)) attrMissing('hostActive', 'gameState', data);
        else if (!('joinActive' in data)) attrMissing('joinActive', 'gameState', data);
        else{
            self.hostActive = data.hostActive;
            self.joinActive = data.joinActive;
            self.counter = data.counter;
            if ('starData' in data && data.stars.length > 0){
                self.starPos[0] = data.stars[0].x;
                self.starPos[1] = data.stars[0].y;
            }
            if ('players' in data){
                for (var i = 0; i < 2; i++){
                    self.players[i].translation = [
                        (self.role !== 'join' ? screen.w - data.players[i].x * self.prop.w : data.players[i].x * self.prop.w),
                        (self.role !== 'join' ? screen.h - data.players[i].y * self.prop.h : data.players[i].y * self.prop.h),
                        0.0
                    ];
                    self.players[i].rotation = -data.players[i].tilt;
                    self.players[i].roll = data.players[i].roll;
                    self.players[i].health = data.players[i].health;
                }
                if (self.role !== 'join') self.players[0].rotation = (self.players[0].rotation + Math.PI) % (Math.PI * 2.0);
                else self.players[1].rotation = (self.players[1].rotation + Math.PI) % (Math.PI * 2.0);
            }
            if ('bullets' in data){
                self.bullets = [];
                for (var i in data.bullets){
                    var newBullet = {};
                    newBullet.translation = [
                        (self.role !== 'join' ? screen.w - data.bullets[i].x * self.prop.w : data.bullets[i].x * self.prop.w), 
                        (self.role !== 'join' ? screen.h - data.bullets[i].y * self.prop.h : data.bullets[i].y * self.prop.h), 
                        0.0
                    ];
                    newBullet.rotation = 
                        (self.role !== 'join' ? (data.bullets[i].tilt + Math.PI) % (Math.PI * 2.0) : data.bullets[i].tilt);
                    newBullet.id = data.bullets[i].id;
                    self.bullets.push(newBullet);
                }
            }
        }
    };
    
    self.step = function(){
        socket.emit('gameCommand', {
            left: self.pressed[0],
            right: self.pressed[1],
            leftTilt: self.pressed[2],
            rightTilt: self.pressed[3],
            fire: self.pressed[4],
            surrender: self.surrender
        });
    };
    
    self.draw = function(){
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        
        // draw background
        for (var i in self.stars){
            mat4.fromTranslation(self.tranMatrix, self.stars[i].translation);
            mat4.rotate(self.tranMatrix, self.tranMatrix, self.stars[i].rotation, [0.0, 0.0, 1.0]);
            mat4.invert(self.normMatrix, self.tranMatrix);
            mat4.transpose(self.normMatrix, self.normMatrix);
            mat4.scale(self.tranMatrix, self.tranMatrix, [0.1, 0.1, 0.1]);
            //mat4.translate(self.tranMatrix, self.tranMatrix, [0, 0, 0]);
            self.objs['sw' + self.stars[i].id].draw();
        }
        
        // draw planets
        for (var i in self.planets){
            mat4.fromTranslation(self.tranMatrix, self.planets[i].translation);
            //mat4.rotate(self.tranMatrix, self.tranMatrix, self.planets[i].rotation, [0.0, 0.0, 1.0]);
            mat4.invert(self.normMatrix, self.tranMatrix);
            mat4.transpose(self.normMatrix, self.normMatrix);
            mat4.scale(self.tranMatrix, self.tranMatrix, [1.0, 1.0, 1.0]);
            //mat4.translate(self.tranMatrix, self.tranMatrix, [0, 0, 0]);
            self.objs['p' + self.planets[i].id].draw();
        }

        // draw players
        for (var i = 0; i < 2; i++){
            // draw ship
            mat4.fromTranslation(self.tranMatrix, self.players[i].translation);
            mat4.rotate(self.tranMatrix, self.tranMatrix, self.players[i].roll,
                        [Math.cos(self.players[i].rotation + Math.PI/2), Math.sin(self.players[i].rotation + Math.PI/2), 0.0]);
            mat4.rotate(self.tranMatrix, self.tranMatrix, self.players[i].rotation, [0.0, 0.0, 1.0]);
            mat4.invert(self.normMatrix, self.tranMatrix);
            mat4.transpose(self.normMatrix, self.normMatrix);
            mat4.scale(self.tranMatrix, self.tranMatrix, [0.4, 0.4, 0.4]);
            //mat4.translate(self.tranMatrix, self.tranMatrix, [0, 0, 0]);
            if ((self.role !== 'join' && i === 0) || (self.role === 'join' && i === 1)) self.objs.r1.draw();
            else self.objs.r2.draw();
            
            // draw helath bar
            var barX = screen.w * 0.1;
            var barY = screen.h * 0.05;
            if ((self.role !== 'join' && i === 0) || (self.role === 'join' && i === 1)){
                barX = screen.w - barX;
                barY = screen.h - barY;
            }
            
            // draw background
            mat4.fromTranslation(self.tranMatrix, [barX, barY, 20.0]);
            mat4.invert(self.normMatrix, self.tranMatrix);
            mat4.transpose(self.normMatrix, self.normMatrix);
            mat4.scale(self.tranMatrix, self.tranMatrix, [1.1, 0.22, 1.0]);
            self.objs.white.draw();
            
            // draw foreground
            mat4.fromTranslation(self.tranMatrix, [barX, barY, 21.0]);
            mat4.invert(self.normMatrix, self.tranMatrix);
            mat4.transpose(self.normMatrix, self.normMatrix);
            mat4.scale(self.tranMatrix, self.tranMatrix, [1.0 * self.players[i].health, 0.2, 1.0]);
            if (self.players[i].health >= 0.3) self.objs.green.draw();
            else self.objs.red.draw();
        }
        
        // draw bullets
        for (var i in self.bullets){
            mat4.fromTranslation(self.tranMatrix, self.bullets[i].translation);
            mat4.rotate(self.tranMatrix, self.tranMatrix, self.bullets[i].rotation, [0.0, 0.0, 1.0]);
            mat4.invert(self.normMatrix, self.tranMatrix);
            mat4.transpose(self.normMatrix, self.normMatrix);
            mat4.scale(self.tranMatrix, self.tranMatrix, [0.1, 0.2, 1.0]);
            self.objs['m' + self.bullets[i].id].draw();
        }
    };
    
    // on key down callback
    self.onKeyDown = function(event){
        if (event.key === 'a' && !self.pressed[0]) self.pressed[0] = true;
        if (event.key === 'd' && !self.pressed[1]) self.pressed[1] = true;
        if (event.key === 'j' && !self.pressed[2]) self.pressed[2] = true;
        if (event.key === 'l' && !self.pressed[3]) self.pressed[3] = true;
        if (event.key === 's' && !self.pressed[4]) self.pressed[4] = true;
    };
    
    // on key up callback
    self.onKeyUp = function(event){
        if (event.key === 'a' && self.pressed[0]) self.pressed[0] = false;
        if (event.key === 'd' && self.pressed[1]) self.pressed[1] = false;
        if (event.key === 'j' && self.pressed[2]) self.pressed[2] = false;
        if (event.key === 'l' && self.pressed[3]) self.pressed[3] = false;
        if (event.key === 's' && self.pressed[4]) self.pressed[4] = false;
    };
    
    var superFinish = self.finish;
    self.finish = function(){ 
        logMsg('game state finished');
        superFinish();
    };
    
    return self;
};
