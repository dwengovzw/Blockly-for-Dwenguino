#!/bin/bash

# @author Tom Neutens (tomneutens@gmail.com)
# IMPORTANT! Run the install script from the directory where you put it! It uses the location from where it is run to configure the paths to the executables!

# @date 02/12/2019 (2nd december 2019)

work_dir=$PWD

# utility functions for shared commands between platforms

# check if running as root
check_for_root () {
    if [ $(/usr/bin/id -u) -ne 0 ]
    then
        echo "Not running as root, you will have to grant permissions to install dependencies."
        root=1
    else
        echo "Running as root..."
        root=0
    fi
}

# Check if python3 is installed
check_python_install () {
    if command -v python3 &>/dev/null
    then
        echo "Python 3 already installed."
    else
        echo "Python 3 is not installed, trying to install."
        sudo apt-get update
        sudo apt-get install python3.6
    fi
    echo "Checking if pyserial is installed."
    python3 -c "import serial"
    res=$?
    if [ $res -eq 0 ]
    then
        echo "Pyserial module already installed!"
    else
        echo "Pyserial not installed, trying to install using pip3."
        echo "Checking if pip3 is installed."
        if which pip3 > /dev/null
        then
            echo "pip3 is installed, skipping..."
        else
            echo "Trying to install pip."
            sudo apt-get install python3-pip
        fi
        echo "Installing pyserial using pip."
        python3 -m pip install pyserial
        echo "Done installing pyserial."
    fi
}

# Check if nodejs is installed
check_nodejs_install () {
    if [ -x "$(command -v node)" ] && [[ $(node -v) == v12* ]]
    then
        echo "nodejs v12 (lts) is installed, skipping..."
    else
        echo "Installing latest lts version of nodejs using root permissions.."
        # add deb.nodesource repo commands
        sudo apt update
        sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
        sudo curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
        # install node
        sudo apt -y install nodejs
        # update npm
        sudo npm install -g npm
    fi
}


#check os type
if [ $OSTYPE == "linux-gnu" ]
then
    echo "Installing for gnu-linux system."

    # Check if script is run as root
    check_for_root

    # Check if python3 is installed
    check_python_install

    # Check nodejs install
    check_nodejs_install

    # Create desktop file if not existant
    touch ./dwenguinoblockly.desktop
    # Empty the file
    > ./dwenguinoblockly.desktop
    # Write contents
    echo '[Desktop Entry]' >> ./dwenguinoblockly.desktop
    echo 'Type=Application' >> ./dwenguinoblockly.desktop
    echo 'Terminal=false' >> ./dwenguinoblockly.desktop
    echo 'Name=dwenguinoblockly' >> ./dwenguinoblockly.desktop
    echo "Icon=$(pwd)/dwengo_robot_plain.svg" >> ./dwenguinoblockly.desktop
    echo "Exec=$(pwd)/start.sh" >> ./dwenguinoblockly.desktop

    chmod u+x ./dwenguinoblockly.desktop
    cp ./dwenguinoblockly.desktop ~/Desktop/dwenguinoblockly.desktop
    gio set ~/Desktop/dwenguinoblockly.desktop "metadata::trusted" yes
    rm ./dwenguinoblockly.desktop
    echo "Created desktop icon!"

    # Install node modules
    npm install
    
    # Configure start file
    echo "#!/bin/bash" > start.sh
    echo "$work_dir/node_modules/electron/dist/electron $work_dir/Blockly-for-Dwenguino/index.html --no-sandbox &" >> start.sh # Start electron
    echo 'electronPid=$!' >> start.sh # get process id for the latest command
    echo "node --experimental-modules $work_dir/backend/index.js &" >> start.sh # start backend
    echo 'nodePid=$!' >> start.sh # get the process id for the latest command
    echo 'echo "DwenguinoBlockly is running"' >> start.sh
    echo 'wait $electronPid' >> start.sh # Wait until electron environment is closed
    echo 'kill $nodePid' >> start.sh # Kill the backend application
    echo 'echo "Quitting DwenguinoBlockly"' >> start.sh
    chmod +x start.sh
    
    # Configure make binaries
    rm ./backend/compilation/bin/make
    cp ./backend/compilation/bin/linux/make ./backend/compilation/bin/make
    echo "Configured make binaries for linux!"

    echo "Adding user to dialout group to get access to the USB ports"
    sudo usermod -a -G dialout $USER
    sudo usermod -a -G tty $USER
    sudo chmod 666 /dev/ttyACM*

    echo "---------------------------------------------------------------------------------------"
    echo "Configured start script!"
    echo "Installation completed, you can launch DwenguinoBlockly using the desktop icon!"
    echo "IMPORTANT! If you can not upload your program to the board because of a permission denied error\
 you should REBOOT your computer and try again.\
Some of the changes made by the script require a reboot before they take effect"
    echo "---------------------------------------------------------------------------------------"

elif [ $OSTYPE ==  "darwin" ]
then
    # MACOS config
    echo "MACOS install is not supported right now"

    # Check if script is run as root
    check_for_root

    # Check if python3 is installed
    check_python_install

    # Check nodejs install
    check_nodejs_install

    # Configure make binaries and some basic linux utils for mac
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    export PATH="$(brew --prefix coreutils)/libexec/gnubin:/usr/local/bin:$PATH"
    brew install coreutils
    brew install make
    brew install nano
    # Get make location
    makeLocation=`which make`
    # Create symbolic link in backend to the make location
    ln -s $makeLocation $work_dir/backend/compilation/macos/make
    echo "Configured make binaries for macos"

    # Configure start file
    echo "#!/bin/bash" > dwenguinoblockly.command
    echo "$work_dir/node_modules/electron/dist/electron $work_dir/Blockly-for-Dwenguino/index.html --no-sandbox &" >> dwenguinoblockly.command # Start electron
    echo 'electronPid=$!' >> dwenguinoblockly.command # get process id for the latest command
    echo "node --experimental-modules $work_dir/backend/index.js &" >> dwenguinoblockly.command # start backend
    echo 'nodePid=$!' >> dwenguinoblockly.command # get the process id for the latest command
    echo 'echo "DwenguinoBlockly is running"' >> dwenguinoblockly.command
    echo 'wait $electronPid' >> dwenguinoblockly.command # Wait until electron environment is closed
    echo 'kill $nodePid' >> dwenguinoblockly.command # Kill the backend application
    echo 'echo "Quitting DwenguinoBlockly"' >> dwenguinoblockly.command
    chmod +x dwenguinoblockly.command
    
    # Copy start file to desktop
    cp dwenguinoblockly.command ~/Desktop
    
    # Install node modules
    npm install --save electron-prebuilt
    npm install



elif [ $OSTYPE == "win32" ]
then
    # Windows config
    echo "Windows install is not supported right now"

    # Configure make binaries
    rm ./backend/compilation/bin/make
    cp ./backend/compilation/bin/windows/make.exe ./backend/compilation/bin/make
    echo "Configured make binaries for windows"
fi
