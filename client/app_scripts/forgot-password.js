// Nikola Jovanovic (NikolaJov96)

// Callbacks initialization for 'forgot-password' page

var email = document.getElementById('email');
var submitBtn = document.getElementById('submitBtn');

// password reset request
submitBtn.onclick = function(){
    if (!socket.connected){ logMsg('Server not yet connected.'); return; }
    
    if (email.value.length === 0) logMsg('Email field empti.');
    else {
        var passwordRecoveryPkg = {
            'email':email.value
        };
        socket.emit('passwordRecovery', passwordRecoveryPkg);
        logMsg('Password recovery requested.');
    }
}

socket.on('passwordRecoveryResponse', function(data){
    if (!('status' in data)) 
        attrMissing('status', 'passwordRecoveryResponse', data);
    
    if (data.status === 0)
        logMsg("On passwordRecoveryResponse - success, check your e-mail");
    else if (data.status === 1)
        logMsg("On passwordRecoveryResponse - e-mail invalid");
    else logMsg("On passwordRecoveryResponse - unknown error");
});