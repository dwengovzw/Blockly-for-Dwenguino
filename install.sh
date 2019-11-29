#!/bin/bash

# @author Tom Neutens (tomneutens@gmail.com)
# IMPORTANT! Run the install script from the directory where you put it! It uses the location from where it is run to configure the paths to the executables!

# utility functions for shared commands between platforms

# check if running as root
check_for_root () {
    if [ $(/usr/bin/id -u) -ne 0 ]
    then
        echo "Not running as root, you will have to install dependencies yourself"
        root=1
    else
        echo "Running as root"
        root=0
    fi
}

# Check if python3 is installed, install if root permissions
check_python_install () {
    if command -v python3 &>/dev/null
    then
        echo Python 3 already installed.
        echo "Checking if pyserial is installed"
        python -c "import serial"
        res=$?
        if [ $res -eq 0 ]
        then
            echo "Pyserial module already installed"
        else
            echo "Installing pyserial using pip"
            python -m pip install pyserial
            echo "Done installing pyserial"
        fi
    else
        if [ $root -eq 1 ]
        then
            echo Python 3 is not installed, trying to install.
            sudo apt-get update
            sudo apt-get install python3.6
            echo "Installing pyserial using pip"
            python -m pip install pyserial
        else
            Python 3 is not installed, install it first!
            exit
        fi
    fi
}

# Check if nodejs is installed, install if root permissions
check_nodejs_install () {
    if which node > /dev/null
    then
        echo "nodejs is installed, skipping..."
    else
        if [ $root -eq 1 ]
        then
            # add deb.nodesource repo commands 
            # install node
            echo "Installing nodejs using root permissions"
            sudo curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
            sudo apt install nodejs
        else
            echo "nodejs is not installed, install it first!"
            exit
        fi
    fi
}


#check os type
if [ $OSTYPE == "linux-gnu" ]
then
    echo "Installing for gnu-linux system"
    
    # Check if script is run as root
    check_for_root
    
    # Check if python3 is installed
    check_python_install

    # Check nodejs install
    check_nodejs_install

    # Create desktop file if not existant
    touch ~/.local/share/applications/dwenguinoblockly.desktop
    # Empty the file
    > ~/.local/share/applications/dwenguinoblockly.desktop
    # Write contents
    echo '[Desktop Entry]' >> ~/.local/share/applications/dwenguinoblockly.desktop
    echo 'Type=Application' >> ~/.local/share/applications/dwenguinoblockly.desktop
    echo 'Terminal=false' >> ~/.local/share/applications/dwenguinoblockly.desktop
    echo 'Name=dwenguinoblockly' >> ~/.local/share/applications/dwenguinoblockly.desktop
    echo "Icon=$(pwd)/dwengo_robot_plain.svg" >> ~/.local/share/applications/dwenguinoblockly.desktop
    echo "Exec=$(pwd)/start.sh" >> ~/.local/share/applications/dwenguinoblockly.desktop
    
    chmod u+x ~/.local/share/applications/dwenguinoblockly.desktop
    cp ~/.local/share/applications/dwenguinoblockly.desktop ~/Desktop/dwenguinoblockly.desktop
    gio set ~/Desktop/dwenguinoblockly.desktop "metadata::trusted" yes
    echo "Created desktop icon"

    # Configure start file
    echo "cd $(pwd)/backend" > start.sh 
    echo "node index" >> start.sh
    chmod +x start.sh
    
    # Configure make binaries
    rm ./backend/compilation/bin/make
    cp ./backend/compilation/bin/linux/make ./backend/compilation/bin/make
    echo "Configured make binaries for linux"
    
    echo "Configured start script"
    echo "Installation completed"
    
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
    
    # Configure make binaries
    rm ./backend/compilation/bin/make
    cp ./backend/compilation/bin/macos/make ./backend/compilation/bin/make
    echo "Configured make binaries for macos"
        
elif [ $OSTYPE == "win32" ]
then
    # Windows config
    echo "Windows install is not supported right now"
    
    # Configure make binaries
    rm ./backend/compilation/bin/make
    cp ./backend/compilation/bin/windows/make.exe ./backend/compilation/bin/make
    echo "Configured make binaries for windows"
fi
