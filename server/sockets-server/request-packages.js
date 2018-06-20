// Owner: Andrija Cicovic (cicovic-andrija)

// Summary: The list of all request packages IDs.

requestPackages = [
    {
        id:'updateAccount',
        file:'./package-handlers/update-account-handler.js',
    },
    {
        id:'passwordRecovery',
        file:'./package-handlers/password-recovery-handler.js',
    },
    {
        id:'pageInit',
        file:'./package-handlers/page-init-handler.js',
    },
    {
        id:'signIn',
        file:'./package-handlers/sign-in-handler.js',
    },
    {
        id:'signOut',
        file:'./package-handlers/sign-out-handler.js',
    },
    {
        id:'signUp',
        file:'./package-handlers/sign-up-handler.js',
    },
    {
        id:'passwordReset',
        file:'./package-handlers/password-reset-handler.js',
    },
    {
        id:'createGameRoom',
        file:'./package-handlers/create-game-room-handler.js',
    },
    {
        id:'selectGameRoom',
        file:'./package-handlers/select-game-room-handler.js',
    },
    {
        id:'sendMessage',
        file:'./package-handlers/send-message-handler.js',
    },
    {
        id:'gameCommand',
        file:'./game-commands-receiver.js',
    },
    {
        id:'getStatistics',
        file:'./package-handlers/statistics-package-handler.js'
    },
    {
        id:'bannUser',
        file:'./package-handlers/bann-user-handler.js'
    },
    {
        id:'getMaps',
        file:'./package-handlers/game-maps-handler.js'
    },
    {
        id:'changeAvatar',
        file:'./package-handlers/change-avatar-handler.js'
    },
    {
        id:'randomGame',
        file:'./package-handlers/random-game-handler.js'
    }
];

module.exports = requestPackages;
