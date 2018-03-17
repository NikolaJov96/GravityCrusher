# GravityCrusher
Online multiplayer space game, also a University project.

## Note about a prototype
This is a prototype branch of the GravityCrusher project. It consists mostly
of static HTML pages. It also features a tic-tac-toe game as a placeholder
for the actual GravityCrusher game that will be available in the final
version of the project.

## Requirements
* **Node.js** runtime environment with **express** and
**socket.<span></span>io** JavaScript packages on a server machine
* MySQL Server on a server machine
* HTML5 support on a client software

## Installation and running
1. To install **Node.js**, visit the [download](https://nodejs.org/en/download/) page of the **Node.js** project and choose the appropriate download option for your operating system.

2. Clone the repository in the desired directory:
```
git clone https://github.com/NikolaJov96/GravityCrusher
```

3. In the root directory of the **GravityCrusher** project install the required packages using **npm** package manager:
```
npm install express socket.io
```

4. Finally, run the server using the following command:
```
node app.js
```