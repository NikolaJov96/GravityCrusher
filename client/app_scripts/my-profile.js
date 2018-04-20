// Owner: Nikola Jovanovic (NikolaJov96)

// Summary: Callbacks initialization for 'my-profile' page

var usernameLabel = document.getElementById('username');
var deactivateBtn = document.getElementById('deactivateBtn');

initCallback = function(data){
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
};

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
