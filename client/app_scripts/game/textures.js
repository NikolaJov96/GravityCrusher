// Owner: Nikola Jovanovic (NikolaJov96)

// Summary: Texture preload function and list of available textures for preload

var preloadTextures = function(){
    var loaded = 0;
    var colorImgs = [
        { name: 'white', color: new Uint8Array([255, 255, 255, 255]) },
        { name: 'green', color: new Uint8Array([0,   255, 0,   255]) },
        { name: 'red',   color: new Uint8Array([255, 0,   0,   255]) }
    ];
    for (var i in colorImgs){
        shapeTextures[colorImgs[i].name] = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, shapeTextures[colorImgs[i].name]);
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(programInfo.samplerUnifLoc, 0);
        gl.texImage2D(gl.TEXTURE_2D, texParams.level, texParams.internalFormat,
                      texParams.width, texParams.height, texParams.border,
                      texParams.srcFormat, texParams.srcType, colorImgs[i].color);
    }
    for (var i in textureList){
        shapeTextures[textureList[i]] = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, shapeTextures[textureList[i]]);
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(programInfo.samplerUnifLoc, 0);
        gl.texImage2D(gl.TEXTURE_2D, texParams.level, texParams.internalFormat,
                      texParams.width, texParams.height, texParams.border,
                      texParams.srcFormat, texParams.srcType, texParams.pixel);
        const image = new Image();
        image.onload = function(ind){
            return function(){
                gl.bindTexture(gl.TEXTURE_2D, shapeTextures[textureList[ind]]);
                gl.texImage2D(gl.TEXTURE_2D, texParams.level, texParams.internalFormat,
                              texParams.srcFormat, texParams.srcType, image);
                gl.generateMipmap(gl.TEXTURE_2D);
                loaded += 1;
                if (loaded >= textureList.length){
                    shapeTextures.allTexturesLoaded = true;
                    overlay.classList.add('d-none');
                }
            };
        }(i);
        image.src = 'app_scripts/game/res/' + textureList[i] + '.png';
    };
};

// list of existing textures, resource files are expected to have the same name and png extension
shapeTextures.allTexturesLoaded = false;
var textureList = [

    'ship', 'ship-r', 'ship-g', 'exhaust', 'star',

    'missles/missle-blue', 'missles/missle-green',
    'missles/missle-red', 'missles/missle-yellow',
    'missles/rocket', 'missles/explosion',

    /*'backgrounds/background-1', 'backgrounds/background-2',
    'backgrounds/background-3', 'backgrounds/background-4',*/

    'planets/planet-1', 'planets/planet-2', 'planets/planet-3', 'planets/planet-4',
    'planets/planet-5', 'planets/planet-6', 'planets/planet-7', 'planets/planet-8',
    'planets/planet-9', 'planets/planet-10', 'planets/planet-11', 'planets/planet-12',
    'planets/planet-13', 'planets/planet-14', 'planets/planet-15',

    'ships/dark-blue-rocket', 'ships/dark-green-rocket', 'ships/dark-red-rocket', 'ships/dark-yellow-rocket',
    'ships/blue-rocket', 'ships/green-rocket', 'ships/red-rocket', 'ships/yellow-rocket',

    'stars/star-1-w', 'stars/star-2-w', 'stars/star-3-w',
    'stars/star-1-y', 'stars/star-2-y', 'stars/star-3-y',
    'stars/shooting-star-white',

];
