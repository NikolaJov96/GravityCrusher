// Owner: Nikola Jovanovic (NikolaJov96)

// Summary: State class representing loading roomState

StateGameEnd = function(){
    // state initialization
    console.log('current state: game end - press space');
    self = abstractState();
    self.pressed = [false, false, false, false];
    self.translation = Math.random() + 1;
    self.rotation = Math.random() * 2 * Math.PI;
    
    // init ship shape
    self.createObject('ship', 'ship', 'ship');
    
    // init projection and view matrices used throughout this roomState
    var projMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
    mat4.lookAt(viewMatrix, [0, 0, 5], [0, 0, 0], [0, 1, 0]);
    gl.uniformMatrix4fv(matProjectionUniformLocation, gl.FALSE, projMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    
    self.draw = function(){
        // draw 1st ship
        self.objs.ship.bind();
        
        mat4.fromTranslation(self.tranMatrix, [self.translation, 0.5, 0.0]);
        mat4.fromRotation(self.rotaMatrix, self.rotation, [0.0, 0.0, 1.0]);
        mat4.fromScaling(self.scalMatrix, [1.0, 1.0, 1.0]);

        gl.uniformMatrix4fv(matRotationUniformLocation, gl.FALSE, self.rotaMatrix);
        gl.uniformMatrix4fv(matTranslationUniformLocation, gl.FALSE, self.tranMatrix);
        gl.uniformMatrix4fv(matScalingUniformLocation, gl.FALSE, self.scalMatrix);

        gl.drawElements(gl.TRIANGLES, objectShapes.ship.ind.length, gl.UNSIGNED_SHORT, 0);
        
        // draw 2nd ship
        self.objs.ship.bind();
        
        mat4.fromTranslation(self.tranMatrix, [0.0, 0.5, 0.0]);
        mat4.fromRotation(self.rotaMatrix, self.rotation, [0.0, 0.0, 0.0]);
        mat4.fromScaling(self.scalMatrix, [0.2, 0.2, 0.2]);

        gl.uniformMatrix4fv(matRotationUniformLocation, gl.FALSE, self.rotaMatrix);
        gl.uniformMatrix4fv(matTranslationUniformLocation, gl.FALSE, self.tranMatrix);
        gl.uniformMatrix4fv(matScalingUniformLocation, gl.FALSE, self.scalMatrix);

        gl.drawElements(gl.TRIANGLES, objectShapes.ship.ind.length, gl.UNSIGNED_SHORT, 0);
    };
    
    // on key up callback, returns next state constructor, or null
    self.onKeyUp = function(event){
        if (event.keyCode === ' '.charCodeAt()) return StateLoading;
        return null;
    };
    
    return self;
};
