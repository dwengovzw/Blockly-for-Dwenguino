if [ $UID -ne 0 -o -z "$DBUS_SESSION_BUS_ADDRESS" ]; then
  echo "Must run as root using 'sudo -E bash'"
  exit 1
fi

cd /root

# Update tree
apt-get update

# Update system
apt-get -f install

# Install software: Chrome, Java
apt install -y chromium-browser openjdk-9-jre

# Arduino
ARDU_VERSION=arduino-1.8.3
ARDU_ARCH=linux64
wget --continue http://downloads.arduino.cc/${ARDU_VERSION}-${ARDU_ARCH}.tar.xz
tar xf ${ARDU_VERSION}-${ARDU_ARCH}.tar.xz
rm -rf /opt/arduino
mv ${ARDU_VERSION} /opt/arduino
#   desktop icon
sudo -i -u ${SUDO_USER} bash /opt/arduino/install.sh
#   dwengo board package
sudo -i -u ${SUDO_USER} mkdir -p ~/.arduino15
echo -e 'board=Dwenguino\ntarget_package=dwenguino\ntarget_platform=avr\nboardsmanager.additional.urls=http://www.dwengo.org/sites/default/files/package_dwengo.org_dwenguino_index.json' | sudo -i -u ${SUDO_USER} tee -a ~/.arduino15/preferences.txt
sudo -i -u ${SUDO_USER} /opt/arduino/arduino --install-boards dwenguino:avr

# settings
usermod -a -G dialout ${SUDO_USER}
usermod -a -G tty ${SUDO_USER}
apt-get purge -y modemmanager*

# DwenguinoBlockly
sudo -i -u ${SUDO_USER} mkdir -p ~/Arduino/tools
wget --continue https://github.com/dwengovzw/Blockly-for-Dwenguino/raw/version2.2/bin/DwenguinoBlocklyArduinoPlugin.zip
unzip DwenguinoBlocklyArduinoPlugin.zip
rm -rf /opt/arduino/tools/DwenguinoBlocklyArduinoPlugin
mv DwenguinoBlocklyArduinoPlugin /opt/arduino/tools/

# Update the Arduino prefs file so it doesn't ask to save on upload
wget --continue https://raw.githubusercontent.com/dwengovzw/Blockly-for-Dwenguino/version2.2/preferences.txt
rm /home/${SUDO_USER}/.arduino15/preferences.txt
mv preferences.txt /home/${SUDO_USER}/.arduino15/
chown dwengo:dwengo /home/${SUDO_USER}/.arduino15/preferences.txt
chmod 644 /home/${SUDO_USER}/.arduino15/preferences.txt

# wallpaper
wget http://ptr.be/dwengo/dwengo.jpg
mv dwengo.jpg /usr/share/xfce4/backdrops/dwengo.jpg
sudo -E -u ${SUDO_USER} xfconf-query -c xfce4-desktop -p /backdrop/screen0/monitor0/workspace0/last-image --set /usr/share/xfce4/backdrops/dwengo.jpg

# remove filesystem icon
#    (hint: to find the property names, run "xfconf-query -c xfce4-desktop -m" while changing settings through the GUI
sudo -E -u ${SUDO_USER} xfconf-query -c xfce4-desktop -p /desktop-icons/file-icons/show-filesystem --set false

# dwengo, shop links
sudo -i -u ${SUDO_USER} tee ~/Desktop/Dwengo.desktop <<EOT
[Desktop Entry]
Version=1.0
Type=Link
Name=Dwengo
Comment=
Icon=gnome-fs-bookmark
URL=http://www.dwengo.org/
EOT
sudo -i -u ${SUDO_USER} tee ~/Desktop/Dwengo\ Shop.desktop <<EOT
[Desktop Entry]
Version=1.0
Type=Link
Name=Dwengo Shop
Comment=
Icon=gnome-fs-bookmark
URL=http://shop.dwengo.org/
EOT
chmod +x /home/${SUDO_USER}/Desktop/Dwengo*.desktop

# Google Blockly
wget https://github.com/google/blockly-games/raw/offline/generated/blockly-games-nl.zip
unzip blockly-games-nl.zip
sudo mv /root/blockly-games /home/${SUDO_USER}/Bureaublad/
sudo chown dwengo:dwengo -R /home/${SUDO_USER}/Bureaublad/blockly-games/

echo "Reboot your system for the changes to take effect!!"

