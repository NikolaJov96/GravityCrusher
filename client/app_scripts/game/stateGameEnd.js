// Owner: Nikola Jovanovic (NikolaJov96)

// Summary: State class representing loading roomState

StateGameEnd = function(data){
    // state initialization
    console.log('current state: game end');
    self = abstractState();
    self.role = data.role;
    self.hostName = data.host;
    self.hostActive = data.hostActive;
    self.joinName = data.join;
    self.joinActive = data.joinActive;
    self.winner = data.winner;
    self.hostPosition = -screen.w * 0.5;
    self.joinPosition = screen.w * 1.5;
    self.rematch = false;
    
    // init ship shape
    self.createObject('darkGreen', 'ship', 'ships/dark-green-rocket');
    self.createObject('darkRed', 'ship', 'ships/dark-red-rocket');
    self.createObject('green', 'ship', 'ships/green-rocket');
    self.createObject('red', 'ship', 'ships/red-rocket');
    
    // UI update
    surrenderBtn.innerHTML = 'Return to home';
    surrenderBtn.onclick = function(){
        window.location = 'index';
    };
    rematchBtn.onclick = function(){
        self.rematch = !self.rematch;
    };
    pl1.innerHTML = self.hostName;
    pl2.innerHTML = self.joinName;
    if (self.winner === ''){
        middle.style.color = 'white';
        middle.innerHTML = 'TIE';
    }else if (self.role === 'spec'){
        middle.style.color = 'white';
        if (self.winner === 'host') middle.innerHTML = '<-';
        else if (self.winner === 'join') middle.innerHTML = '->';
        else middle.innerHTML = '==';
    }else if (self.winner === self.role){
        middle.style.color = 'green';
        middle.innerHTML = 'WIN';
    }else{
        middle.style.color = 'red';
        middle.innerHTML = 'LOST';
    }
    
    if (self.role !== 'join'){
        pl1.style.color = 'green';
        pl2.style.color = 'red';
    }else{
        pl1.style.color = 'red';
        pl2.style.color = 'green';
    }
    rematchBtn.classList.remove("d-none");
    
    // init projection and view matrices used throughout this roomState
    mat4.ortho(self.projMatrix, -screen.w / 2.0, screen.w / 2.0, 
               screen.h / 2.0, -screen.h / 2.0, 0, 1000);
    mat4.lookAt(self.viewMatrix, [screen.w / 2.0, screen.h / 2.0, 200], 
                [screen.w / 2.0, screen.h / 2.0, 0], [0, 1, 0]);
    self.lightSource = new Float32Array([screen.w, screen.h, 500.0]);
    self.ambientColor = new Float32Array([0.5, 0.5, 0.5]);
    self.directedColor = new Float32Array([0.5, 0.5, 0.5]);
    
    self.handleStatePackage = function(data){
        if ('redirect' in data) window.location = 'index';
            
        else if (!('hostActive' in data)) attrMissing('hostActive', 'gameState', data);
        else if (!('joinActive' in data)) attrMissing('joinActive', 'gameState', data);
        else if (!('rematch' in data)) attrMissing('rematch', 'gameState', data);
        else{
            self.hostActive = data.hostActive;
            self.joinActive = data.joinActive;
            if (data.rematch){
                rematchBtn.classList.remove("btn-danger");
                rematchBtn.classList.add("btn-success");
            }else{
                rematchBtn.classList.remove("btn-success");
                rematchBtn.classList.add("btn-danger");
            }
        }
    };
    
    self.step = function(){  
        if (self.hostPosition < screen.w * 0.33) self.hostPosition += screen.w * 0.03;
        if (self.joinPosition > screen.w * 0.66) self.joinPosition -= screen.w * 0.03;
        socket.emit('gameCommand', {rematch: self.rematch})
    };
    
    self.draw = function(){
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        
        // draw host ship
        mat4.fromTranslation(self.tranMatrix, [self.hostPosition, screen.h * 0.4, 0.0]);
        mat4.rotate(self.tranMatrix, self.tranMatrix, -Math.PI / 2.0, [0.0, 0.0, 1.0]);
        mat4.invert(self.normMatrix, self.tranMatrix);
        mat4.transpose(self.normMatrix, self.normMatrix);
        if (self.winner === 'host') mat4.scale(self.tranMatrix, self.tranMatrix, [1.2, 1.2, 1.2]);
        else mat4.scale(self.tranMatrix, self.tranMatrix, [0.5, 0.5, 0.5]);
        if (self.role === 'join'){
            if (self.hostActive) self.objs.red.draw();
            else self.objs.darkRed.draw();
        }else{
            if (self.hostActive) self.objs.green.draw();
            else self.objs.darkGreen.draw();
        }
        
        // draw join ship
        mat4.fromTranslation(self.tranMatrix, [self.joinPosition, screen.h * 0.6, 0.0]);
        mat4.rotate(self.tranMatrix, self.tranMatrix, Math.PI / 2.0, [0.0, 0.0, 1.0]);
        mat4.invert(self.normMatrix, self.tranMatrix);
        mat4.transpose(self.normMatrix, self.normMatrix);
        if (self.winner === 'join') mat4.scale(self.tranMatrix, self.tranMatrix, [1.2, 1.2, 1.2]);
        else mat4.scale(self.tranMatrix, self.tranMatrix, [0.5, 0.5, 0.5]);
        if (self.role === 'join'){
            if (self.joinActive) self.objs.green.draw();
            else self.objs.darkGreen.draw();
        }else{
            if (self.joinActive) self.objs.red.draw();
            else self.objs.darkRed.draw();
        }
    };
    
    var superFinish = self.finish;
    self.finish = function(){ 
        logMsg('game-end state finished');
        superFinish();
    };
    
    return self;
};
