## Dwenguinoblockly

Dwenguinoblockly is a javascript application with nodejs backend which enables programming of the Dwenguino board (dwengo.org/dwenguino) using the blockly graphical code editor.

The application has the following features:

* Using the blocks editor to create arduino/dwenguino c++ code.
* Live translation of blocks to code.
* In browser simulation environment with different scenarios.
* Predefined tutorials to be used in a classroom.
* Multiple language support (english, dutch, french, german, greek, italian, malay)
* Direct compilation and upload to the Dwenguino board through nodejs application.


Right now the backend was tested on Ubuntu 18.04 and runs when executing the install.sh script in the root of the repository.
The frontend runs on all plaforms and is available on dwengo.org/dwenguinoblockly.


### Dependencies

* nodejs
* python3
    * pyserial module
* google chrome

### Installing the application

On Linux use the install script `install.sh` to install the application locally.

### Building the application

#### In production

Run `npm install` and use `npm run build` to build the application. Start the backend application with `/backend/index.js`.

#### In development

Run `npm install` and use `npm run build-dev` to build the application. This makes debugging in the browser possible. Use the script `start.sh` to start the server locally.

### Contributing

We refer to [this styleguide](https://google.github.io/styleguide/jsguide.html) to help you contribute to the Dwenguinoblockly project. 

The documentation can be accessed from the `docs` folder (`docs/index.html`). You can generate new documentation by running the following command: `./node_modules/.bin/jsdoc -c jsdoc-conf.json -r -d docs`.


