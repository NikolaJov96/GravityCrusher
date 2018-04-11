// Owner: Filip Mandic (mandula8)

// Summary: This file contains tests which are used to test database and all queries written to this date
// File will be used and modified only by the owner

var db = require('./../database-interface');

tests = {
    insertUser: function(){
        var fun = 'test Insert new user';
        var callbackTest = function(exprectedStatus){
            return function(status, email, username, confirmationCode) {
                if (status === exprectedStatus) console.log('OK  ' + fun + ': ' + status);
                else{
                    console.log('ERROR ' + fun);
                    console.log('expected status: ' + exprectedStatus);
                    console.log('status: ' + status);
                    console.log('email: ' + email);
                    console.log('username: ' + username);
                    console.log('confirmationCode: ' + confirmationCode);
                    console.log();
                }
            };
        };

        var test_ulazi = [
            ['filipmandic80@gmail.com', 'Dragana', '545455454554', '656566566555', '545616616161614535'],
            ['MacOsmail@dd', 'Andrija', '454544545455', '848484848484', '5456166161542'],
            ['filipmandic26@gmail.com', 'Janko', '156164231515510', '54561661616161', '5656116151161']
        ]

        db.createNewUser('filipmandic80@gmail.com', 'Dragana', '545455454554', '656566566555', '54561661535',
                         callbackTest('EmailTaken'));
        db.createNewUser('MacOsmail@dd', 'Andrija', '454544545455', '848484848484', '5456166161542',
                         callbackTest('UsernameTaken'));
        db.createNewUser('filipmandic26@gmail.com', 'Janko', '156164231515510', '54561661616161', '5656116151161',
                         callbackTest('Success'));
    },
    confirmUser: function(){
        var fun = 'confirming user tests';
        var callbackTest = function(exprectedStatus){
            return function(status, username) {
                if (status === exprectedStatus) console.log('OK  ' + fun + ': ' + status);
                else{
                    console.log('ERROR ' + fun);
                    console.log('expected status: ' + exprectedStatus);
                    console.log('status: ' + status);
                    console.log('username: ' + username);
                    console.log();
                }
            };
        };

        var test_ulazi = [
            ['Marko', 'aapotvrdimarkosvojnalog686868'],
            ['Marko', '5181111818181818'],
            ['Dragana', '5656116151161']
        ]

        db.confirmUser('Dragana', '5656116151161', callbackTest('UserNotRegistered'));
        db.confirmUser('Marko', '5181111818181818', callbackTest('InvalidConfirmationCode'));
        db.confirmUser('Marko', 'aapotvrdimarkosvojnalog686868', callbackTest('Success'));
    },
    getSaltUsername: function(){
        var fun = 'getting salt from user';
        var callbackTest = function(exprectedStatus){
            return function(status, salt) {
                if (status === exprectedStatus) console.log('OK  ' + fun + ': ' + status);
                else{
                    console.log('ERROR ' + fun);
                    console.log('expected status: ' + exprectedStatus);
                    console.log('status: ' + status);
                    console.log('salt: ' + salt);
                    console.log();
                }
            };
        };

        var test_ulazi = [
            ['Marko'],
            ['Nikola'],
            ['Dragana']
        ]

        db.getSaltByUsername('Dragana', callbackTest('UserNotRegistered'));
        db.getSaltByUsername('Marko', callbackTest('Success'));
        db.getSaltByUsername('Nikola', callbackTest('Success'));
    },
    changePassword: function(){
        var fun = 'test change password';
        var callbackTest = function(exprectedStatus){
            return function(status) {
                if (status === exprectedStatus) console.log('OK  ' + fun + ': ' + status);
                else{
                    console.log('ERROR ' + fun);
                    console.log('expected status: ' + exprectedStatus);
                    console.log('status: ' + status);
                    console.log();
                }
            };
        };

        var test_ulazi = [
            ['Dragana', '8461614611', '545455454554', '656566566555', '545616616161614535'],
            ['Andrija', '4561511111561', '454544545455', '848484848484', '5456166161542'],
            ['Andrija', '123456789123456789aaaffccddd', '0123456789abcdef', '5656116151161']
        ]

        db.changePassword('Perica', '156164231515510', '54561661616161', '848444644664464',
                          callbackTest('UserNotRegistered'));
        db.changePassword('Andrija', '156164231515510', '54561661616161', '848444644664464',
                          callbackTest('PasswordNoMatch'));
        db.changePassword('Andrija', '123456789aaaffccddd', '0123456789abcdef', '5656116151161',
                          callbackTest('Success'));
    },
    changeUsername: function(){
        var fun = 'test change username';
        var callbackTest = function(exprectedStatus){
            return function(status) {
                if (status === exprectedStatus) console.log('OK  ' + fun + ': ' + status);
                else{
                    console.log('ERROR ' + fun);
                    console.log('expected status: ' + exprectedStatus);
                    console.log('status: ' + status);
                    console.log();
                }
            };
        };

        var test_ulazi = [
            ['Dragana', 'Dragan', '545455454554'],
            ['Andrija', 'Filip', '454544545455'],
            ['Andrija', 'Dajana', '4654564654644646'],
            ['Andrija', 'Dajana','123456789123456789aaaffccddd']
        ]

        db.changeUsername('Dragana', 'Dragan', '545455454554', callbackTest('UserNotRegistered'));
        db.changeUsername('Andrija', 'Filip', '454544545455', callbackTest('UsernameTaken'));
        db.changeUsername('Andrija', 'Dajana', '4654564654644646', callbackTest('PasswordNoMatch'));
        db.changeUsername('Andrija', 'Dajana','123456789aaaffccddd', callbackTest('Success'));
    },
    passwordRecovery: function(){
        var fun = 'password recovery request';
        var callbackTest = function(exprectedStatus){
            return function(status, salt) {
                if (status === exprectedStatus) console.log('OK  ' + fun + ': ' + status);
                else{
                    console.log('ERROR ' + fun);
                    console.log('expected status: ' + exprectedStatus);
                    console.log('status: ' + status);
                    console.log('salt: ' + salt);
                    console.log();
                }
            };
        };

        var test_ulazi = [
            ['linux@etf.rs', 'linuxresetujesvojusifru'],
            ['jelena6@gmail.com', 'jelenaresetujesvojusifru'],
            ['milica6@gmail.com', 'milicaresetujesvojusifru']
        ]

        db.createPasswordRecoveryRequest('linux@etf.rs', 'linuxresetujesvojusifru',
                                         callbackTest('UserNotRegistered'));
        db.createPasswordRecoveryRequest('jelena6@gmail.com', 'jelenaresetujesvojusifru',
                                         callbackTest('Success'));
        db.createPasswordRecoveryRequest('milica6@gmail.com', 'milicaresetujesvojusifru',
                                         callbackTest('Success'));
    },
    getSaltEmail: function(){
        var fun = 'selecting salt by email';
        var callbackTest = function(exprectedStatus){
            return function(status, salt) {
                if (status === exprectedStatus) console.log('OK  ' + fun + ': ' + status);
                else{
                    console.log('ERROR ' + fun);
                    console.log('expected status: ' + exprectedStatus);
                    console.log('status: ' + status);
                    console.log('salt: ' + salt);
                    console.log();
                }
            };
        };

        var test_ulazi = [
            ['Dragana6@gmail.com'],
            ['Nikola7@gmail.com'],
            ['Marko6@gmail.com']
        ]

        db.getSaltByEmail('Dragana6@gmail.com', callbackTest('UserNotRegistered'));
        db.getSaltByEmail('Nikola7@gmail.com', callbackTest('UserNotRegistered'));
        db.getSaltByEmail('Marko6@gmail.com', callbackTest('Success'));
    },
    verifyWithUsername: function(){
        var fun = 'verification of user with username';
        var callbackTest = function(exprectedStatus){
            return function(status) {
                if (status === exprectedStatus) console.log('OK  ' + fun + ': ' + status);
                else{
                    console.log('ERROR ' + fun);
                    console.log('expected status: ' + exprectedStatus);
                    console.log('status: ' + status);
                    console.log();
                }
            };
        };

        var test_ulazi = [
            ['Dragana', 'tralalalalala'],
            ['jelena', 'tralalalalalala'],
            ['Nikola', 'aaaaaaaaafffffdddddcdccc']
        ]

        db.verifyUserByUsername('Dragana', 'tralalalalala', callbackTest('Success'));//UserNotRegistered
        db.verifyUserByUsername('jelena', 'tralalalalalala', callbackTest('Success'));//PasswordNoMatch
        db.verifyUserByUsername('Nikola', 'aaaaaaaaafffffdddddcdccc', callbackTest('Success'));
    },
    verifyWithEmail: function(){
        var fun = 'verification of user with email';
        var callbackTest = function(exprectedStatus){
            return function(status) {
                if (status === exprectedStatus) console.log('OK  ' + fun + ': ' + status);
                else{
                    console.log('ERROR ' + fun);
                    console.log('expected status: ' + exprectedStatus);
                    console.log('status: ' + status);
                    console.log();
                }
            };
        };

        var test_ulazi = [
            ['Dragana6@gmail.com', 'tralalalalala'],
            ['jelena6@gmail.com', 'tralalalalalala'],
            ['Nikola6@gmail.com', 'aaaaaaaaafffffdddddcdccc']
        ]

        db.verifyUserByEmail('Dragana6@gmail.com', 'tralalalalala', callbackTest('Success'));//UserNotRegistered
        db.verifyUserByEmail('jelena6@gmail.com', 'tralalalalalala', callbackTest('Success'));//PasswordNoMatch
        db.verifyUserByEmail('Nikola6@gmail.com', 'aaaaaaaaafffffdddddcdccc', callbackTest('Success'));
    },
    insertTokenUsername: function(){
        var fun = 'inserting token by username';
        var callbackTest = function(exprectedStatus){
            return function(status) {
                if (status === exprectedStatus) console.log('OK  ' + fun + ': ' + status);
                else{
                    console.log('ERROR ' + fun);
                    console.log('expected status: ' + exprectedStatus);
                    console.log('status: ' + status);
                    console.log();
                }
            };
        };

        var test_ulazi = [
            ['Dragana', 'mdiemdoemddoi'],
            ['Milica', 'aaabbbccccccc'],
            ['Jovan', 'aaabbbccccccd']
        ]

        db.assignTokenByUsername('Dragana', 'mdiemdoemddoi', callbackTest('UserNotRegistered'));
        db.assignTokenByUsername('Milica', 'aaabbbccccccc', callbackTest('Success'));
        db.assignTokenByUsername('Jovan', 'aaabbbccccccd', callbackTest('Success'));
    },
    insertTokenEmail: function(){
        var fun = 'inserting token by email';
        var callbackTest = function(exprectedStatus){
            return function(status) {
                if (status === exprectedStatus) console.log('OK  ' + fun + ': ' + status);
                else{
                    console.log('ERROR ' + fun);
                    console.log('expected status: ' + exprectedStatus);
                    console.log('status: ' + status);
                    console.log();
                }
            };
        };

        var test_ulazi = [
            ['Dragana6@gmail.com', 'mdiemdoemddoi'],
            ['Milica6@gmail.com', 'aaabbbaaacccc'],
            ['Jovan6@gmail.com', 'aaabbbaaacccd']
        ]

        db.assignTokenByEmail('Dragana6@gmail.com', 'mdiemdoemddoi', callbackTest('UserNotRegistered'));
        db.assignTokenByEmail('Milica6@gmail.com', 'aaabbbaaacccc', callbackTest('Success'));
        db.assignTokenByEmail('Jovan6@gmail.com', 'aaabbbaaacccd', callbackTest('Success'));
    },
};

// test all
// for (var test in tests){
//     tests[test]();
// }

// test specific
tests.verifyWithUsername();
tests.verifyWithEmail();