# GravityCrusher
GravityCrusher is a two-player space shooter game focused on gravitational
effects and colorful graphics.

This project is also a team assignment on a Software Engineering Department's 3rd year course called *Principles of Software Engineering*, at the School of Electrical Engineering from University of Belgrade.

## Features
* Users can sign up for user accounts and become registered players
* Everyone can create/join game rooms and play the game
* Registered players are ranked on various scoreboards!
* Users can join playing rooms as spectators and watch an ongoing game
* Players and spectators can chat while the game is on!

## Requirements
* **Node.js** runtime environment with the following Node.js JavaScript packages
  installed on a server machine:
    * `express`
    * `socket.io`
    * `nodemailer`
    * `mysql`
    * `uuid`

* MySQL Server on a server machine
* HTML5 support on a client web browsing software

## Installation and running
1. To install **Node.js**, visit the [download](https://nodejs.org/en/download/)
   page of the **Node.js** project and choose the appropriate download option
   for your operating system.

2. Clone the repository in the desired directory:
```
git clone https://github.com/NikolaJov96/GravityCrusher
```

3. Make sure you have an instance of MySQL Server running on the server machine.
In order to properly run the server, you need to execute a self-contained SQL script which will
create and populate a database. The script is located inside the `server/sql-server`
directory. One way of doing this would be from inside MySQL Workbench by selecting
the following option:
```
 i) Server -> Data Import -> Import from Disk -> Import from Self-Contained File
ii) Start Import
```

4. In the root directory of the **GravityCrusher** project install the required
packages using **npm** package manager:
```
npm install express socket.io nodemailer mysql uuid
```

5. Some configuration files are not in the repository because they contain
information such as usernames or passwords for an email or database account,
but the are required in order to properly run the server. Examples of how
these files must look like and where they must be placed in the project
directory tree can be found in the `examples` directory.

6. Finally, run the server using the following command:
```
node app
```

## Running the server on a specific Internet address
Modify the following files:
 * `./app-config.js` -- modify the `domainName` field
 * `./client/app_scripts/init-connection.js` -- initialize the `socket` global variable
   with appropriate address

## Documentation
All available documentation (description, use cases, data model etc) can be found
under the `doc` directory tree.

