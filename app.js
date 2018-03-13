// author: Nikola Jovanovic (NikolaJov96)

// listener processing http get requests
require('./server/httpServer/httpServer.js')(__dirname);

// listener processing socket.io requests 
require('./server/socketsServer/socketsServer.js');
