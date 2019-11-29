#!/bin/bash

# @author Tom Neutens (tomneutens@gmail.com)
# IMPORTANT! Run the install script from the directory where you put it! It uses the location from where it is run to configure the paths to the executables!

# check if running as root
if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "Not running as root, you will have to install dependencies yourself"
    root=1
else
    echo "Running as root"
    root=0
fi

# Check if python3 is installed
if command -v python3 &>/dev/null; then
    echo Python 3 already installed.
else
    if [[ $root -eq 1 ]]; then
        echo Python 3 is not installed, trying to install.
        sudo apt-get update
        sudo apt-get install python3.6
    else
        Python 3 is not installed, install it first!
        exit
    fi
fi

if which node > /dev/null
    then
        echo "node is installed, skipping..."
    else
        if [[ $root -eq 1 ]]; then
            # add deb.nodesource repo commands 
            # install node
            sudo curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
            sudo apt install nodejs
        else
            nodejs is not installed, install it first!
            exit
        fi
    fi

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
gio set ~/Desktop/dwenguinoblockly.desktop "metadata::trusted" yes

cp ~/.local/share/applications/dwenguinoblockly.desktop ~/Desktop/dwenguinoblockly.desktop

# Configure start file
echo "cd $(pwd)/backend" > start.sh 
echo "node index" >> start.sh
chmod +x start.sh

