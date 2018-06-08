// Owner: Nikola Jovanovic (NikolaJov96)

// Summary: State class representing loading roomState

StateLoading = function(data){
    // state initialization
    console.log('current state: game loading');
    self = abstractState();
    self.role = data.role;
    self.hostName = data.host;
    self.hostActive = data.hostActive;
    self.hostReady = data.hostReady;
    self.joinName = data.join;
    self.joinActive = data.joinActive;
    self.joinReady = data.joinReady;
    self.counter = data.counter;
    self.hostPosition = -screen.w * 0.5;
    self.joinPosition = screen.w * 1.5;
    
    // init ship shape
    self.createObject('darkGreen', 'ship', 'ships/dark-green-rocket');
    self.createObject('darkRed', 'ship', 'ships/dark-red-rocket');
    self.createObject('green', 'ship', 'ships/green-rocket');
    self.createObject('red', 'ship', 'ships/red-rocket');
    self.createObject('blue', 'ship', 'ships/blue-rocket');
    
    // UI update
    if (self.role === 'host'){
        surrenderBtn.innerHTML = 'close room';
        surrenderBtn.onclick = function(){
            socket.emit('gameCommand', { close: true });
            return false;
        };
    }
    pl1.innerHTML = self.hostName;
    pl2.innerHTML = '?';
    middle.innerHTML = 'VS';
    if (self.role !== 'join'){
        pl1.style.color = 'green';
        pl2.style.color = 'red';
    }else{
        pl1.style.color = 'red';
        pl2.style.color = 'green';
    }
    
    // init projection and view matrices used throughout this roomState
    mat4.ortho(self.projMatrix, -screen.w / 2.0, screen.w / 2.0, 
               screen.h / 2.0, -screen.h / 2.0, 0, 1000);
    mat4.lookAt(self.viewMatrix, [screen.w / 2.0, screen.h / 2.0, 200], 
                [screen.w / 2.0, screen.h / 2.0, 0], [0, 1, 0]);
    self.lightSource = new Float32Array([screen.w / 2.0, 0.0, 120.0]);
    self.ambientColor = new Float32Array([0.5, 0.5, 0.5]);
    self.directedColor = new Float32Array([0.5, 0.5, 0.5]);
    
    self.handleStatePackage = function(data){
        if ('redirect' in data) window.location = 'index';
            
        else if (!('hostActive' in data)) attrMissing('hostActive', 'gameState', data);
        else if (!('hostReady' in data)) attrMissing('hostReady', 'gameState', data);
        else if (!('joinActive' in data)) attrMissing('joinActive', 'gameState', data);
        else if (!('joinReady' in data)) attrMissing('joinReady', 'gameState', data);
        else{
            logMsg(data);
            self.hostActive = data.hostActive;
            self.hostReady = data.hostReady;
            self.joinActive = data.joinActive;
            self.joinReady = data.joinReady;
            self.joinName = data.join;
            self.counter = data.counter;
            
            if (self.joinActive && self.role !== 'spec'){
                surrenderBtn.innerHTML = 'surrender';
                surrenderBtn.onclick = function(){
                    socket.emit('gameCommand', { surrender: true });
                    return false;
                };
            }
        }
    };
    
    self.step = function(){
        if (self.hostReady || self.hostActive){
            if (self.hostPosition < screen.w * 0.25) self.hostPosition += screen.w * 0.04;
        }else{
            if (self.hostPosition > -screen.w * 0.25) self.hostPosition -= screen.w * 0.04;
        }
        
        if (self.joinReady || self.joinActive){
            if (self.joinPosition > screen.w * 0.75) self.joinPosition -= screen.w * 0.04;
        }else{
            if (self.joinPosition < screen.w * 1.25) self.joinPosition += screen.w * 0.04;
        }
        
        if (self.joinActive) pl2.innerHTML = self.joinName;
    };
    
    self.draw = function(){
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        
        // draw host ship
        mat4.fromTranslation(self.tranMatrix, [self.hostPosition, screen.h * 0.4, 0.0]);
        mat4.rotate(self.tranMatrix, self.tranMatrix, -Math.PI / 2.0, [0.0, 0.0, 1.0]);
        mat4.invert(self.normMatrix, self.tranMatrix);
        mat4.transpose(self.normMatrix, self.normMatrix);
        mat4.scale(self.tranMatrix, self.tranMatrix, [1.2, 1.2, 1.2]);
        if (self.role === 'join'){
            if (self.hostReady) self.objs.red.draw();
            else self.objs.darkRed.draw();
        }else{
            if (self.hostReady) self.objs.green.draw();
            else self.objs.darkGreen.draw();
        }
        
        // draw join ship
        mat4.fromTranslation(self.tranMatrix, [self.joinPosition, screen.h * 0.6, 0.0]);
        mat4.rotate(self.tranMatrix, self.tranMatrix, Math.PI / 2.0, [0.0, 0.0, 1.0]);
        mat4.invert(self.normMatrix, self.tranMatrix);
        mat4.transpose(self.normMatrix, self.normMatrix);
        mat4.scale(self.tranMatrix, self.tranMatrix, [1.2, 1.2, 1.2]);
        if (self.role === 'join'){
            if (self.joinReady) self.objs.green.draw();
            else self.objs.darkGreen.draw();
        }else{
            if (self.joinReady) self.objs.red.draw();
            else self.objs.darkRed.draw();
        }
        
        // draw counter
        for (var i = 1; i < self.counter; i++){
            mat4.fromTranslation(self.tranMatrix, [screen.w * (0.56 - 0.01 * i), screen.h * (i + 1) / 12.0, 0.0]);
            mat4.rotate(self.tranMatrix, self.tranMatrix, Math.PI, [0.0, 0.0, 1.0]);
            mat4.invert(self.normMatrix, self.tranMatrix);
            mat4.transpose(self.normMatrix, self.normMatrix);
            mat4.scale(self.tranMatrix, self.tranMatrix, [0.2, 0.2, 0.2]);
            self.objs.blue.draw();
        }
    };
    
    self.onKeyPress = function(event){
        // on press change ready status
        if ([' ', 'Enter', 's', 'r'].includes(event.key)){
            if (self.role === 'host') socket.emit('gameCommand', { ready: (self.hostReady ? false : true) });
            else if (self.role === 'join') socket.emit('gameCommand', { ready: (self.joinReady ? false : true) });
            else logMsg('Undefined role: ' + self.role);
        }
    };
    
    var superFinish = self.finish;
    self.finish = function(){ 
        logMsg('loading state finished');
        superFinish();
    };
    
    return self;
};
