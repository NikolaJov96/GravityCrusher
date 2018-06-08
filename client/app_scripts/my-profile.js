// Owner: Nikola Jovanovic (NikolaJov96)

// Summary: Callbacks initialization for 'my-profile' page

var usernameLabel = document.getElementById('username');
var deactivateBtn = document.getElementById('deactivateBtn');
var chAvatar = document.getElementById('chAvatar');
var image = document.getElementById('image');
var profileAvatar = document.getElementById('profileAvatar');

initCallback = function(data){
    if ('payload' in data && 'redirect' in data.payload && data.payload.redirect){
        window.location = 'index';
        return;
    }
    
    if (avatar) profileAvatar.src = 'data:image/png;base64,' + avatar;
    usernameLabel.innerHTML = 'Username: ' + username;
};
if (initCallbackData) initCallback(initCallbackData);

// sign out button handler
deactivateBtn.onclick = function(){
    var signOutPkg = {
        'token':getCookie('token'),
        'disable':true
    };
    socket.emit('signOut', signOutPkg);
    logMsg('Sign-out and account deactivation requested.');
    return false;
};

chAvatar.onclick = function(){
    image.click();
};

image.onchange = function(e){
    if (image.files.length > 0){
        var file = image.files[0];
        var reader = new FileReader();
        
        reader.onload = function(e){
            socket.emit('changeAvatar', { img: e.target.result });
        };
        
        reader.readAsBinaryString(file);
    }
};

socket.on('changeAvatarResponse', function(data){
    if (!('status' in data)) attrMissing('status', 'changeAvatarResponse', data);
    
    if (data.status === 'Success'){
        logMsg('On changeAvatarResponse - success'); 
        window.location = 'my-profile';
    }else logMsg('On changeAvatarResponse - unknown error: ' + data.status);
});

// socket.on('signOutResponse', callback) already defined in 'universal', which is included in all pages

/*socket.on('signOutResponse', function(data){
    if (!('status' in data)) attrMissing('status', 'updateAccountResponse', data);
    
    if (data.status === 'Success'){ 
        logMsg('On signOutResponse - success'); 
        setCookie('token', '', 0);
        window.location = '/'; 
    }else if (data.status === 'TokenNoMatch') logMsg('On signOutResponse - invalid token');
    else logMsg('On signOutResponse - unknown error: ' + data.status);
});*/
