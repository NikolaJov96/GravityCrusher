// Owner: Nikola Jovanovic (NikolaJov96)

// Summary: Callbacks initialization for 'forgot-password' page

var email = document.getElementById('email');
var submitBtn = document.getElementById('submitBtn');
var errorLabel = document.getElementById('errorLabel');

// password reset request
submitBtn.onclick = function(){
    errorLabel.innerHTML = '';
    if (!socket.connected){ logMsg('Server not yet connected.'); return; }
    
    var emailVal = validityCheck.email(email.value);
    if (emailVal === 1){
        errorLabel.innerHTML = 'Email field empty';
        logMsg('Email field empti.');
        email.focus();
    }else if (emailVal === 2){
        errorLabel.innerHTML = 'Email format incorrect';
        logMsg('Email format incorrect.');
        email.focus();
    }else{
        var passwordRecoveryPkg = {
            'email':email.value
        };
        socket.emit('passwordRecovery', passwordRecoveryPkg);
        logMsg('Password recovery requested.');
    }
    return false;
};

socket.on('passwordRecoveryResponse', function(data){
    if (!('status' in data)) attrMissing('status', 'passwordRecoveryResponse', data);
    
    if (data.status === 'Success'){
        errorLabel.style.color = 'green';
        errorLabel.innerHTML = 'Success, check your email!';
        logMsg('On passwordRecoveryResponse - success, check your e-mail');
    }else if (data.status === 'UserNotRegistered'){
        errorLabel.innerHTML = 'Email not registered';
        logMsg('On passwordRecoveryResponse - account not registered');
        email.select();
        email.focus();
    }else logMsg('On passwordRecoveryResponse - unknown error: ' + data.status);
});
