
ECHO "Installing DwenguinoBlockly"

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

echo "Checking python install"
python --version
If (-not $?){
  echo "test"
}
If(-not $?){
  echo "Python not installed, installing..."
  Invoke-WebRequest -Uri "https://www.python.org/ftp/python/3.7.0/python-3.7.0.exe" -OutFile "c:/temp/python-3.7.0.exe"
  c:/temp/python-3.7.0.exe /quiet InstallAllUsers=0 PrependPath=1 Include_test=0
  python --version
  If(-not $?){
    echo "Python installation failed, exiting.."
    exit 1
  }

}


echo "Python is installed, continuing"
echo "Updating pip"
python -m pip install --upgrade pip
echo "Installing pyserial"
pip3 install pyserial


echo "Checking nodejs install"
node -v
If (-not $?){
  echo "Nodejs is not installed, installing..."
  Invoke-WebRequest -Uri "https://nodejs.org/dist/v12.18.3/node-v12.18.3-x64.msi" -OutFile "c:/temp/node-v12.18.3-x64.msi"
  c:/temp/node-v12.18.3-x64.msi

  node -v
  If (-not $?){
    echo "Nodejs install failed, exiting.."
    exit 1
  }
}

echo "nodejs and npm are installed correctly"

electron -v
If (-not $?){
  echo "electron node package not installed, installing.."
  Invoke-Expression "npm install electron -g"
}
echo Installing node dependencies
Invoke-Expression "npm install -g npm"

echo "Checking mongodb install"
mongo -version 3>NUL
if (-not $?) {
  echo "Monodb not installed, trying to install.."
  if (-not (Test-Path -LiteralPath c:/temp/mongodb.zip)) 
  {
    Invoke-WebRequest -Uri "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-4.4.1.zip" -OutFile "c:/temp/mongodb.zip"
    Expand-Archive -LiteralPath c:/temp/mongodb.zip -DestinationPath ~/mongodb/
  }
  echo "Adding to path"
  $addPath = $HOME + "\mongodb\mongodb-win32-x86_64-windows-4.4.1\bin"
  echo "Current path:"
  $oldPath = (Get-ItemProperty -Path 'Registry::HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager\Environment' -Name PATH).path
  echo $oldPath

  Test-Path $addPath -IsValid
  if (Test-Path $addPath -IsValid){
    $regexAddPath = [regex]::Escape($addPath)
    $arrPath = $oldPath -split ';' | Where-Object {$_ -notMatch "^$regexAddPath\\?"}
    $newPath = ($arrPath + $addPath) -join ';'
    Set-ItemProperty -Path 'Registry::HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager\Environment' -Name PATH -Value $newPath
  } else {
    Throw "'$addPath' is not a valid path."
  }
  echo "Mongodb added to path, reboot required for changes to take effect.."
} 

echo "Configuring the start script"

echo "#!/usr/bin/env pwsh" > start.ps1
echo "# Start mongodb server" >> start.ps1
echo '$database_process = Start-Process -PassThru -NoNewWindow -FilePath "mongod"' >> start.ps1
echo 'echo $database_process' >> start.ps1

echo '# Start DwenguinoBlockly backend server' >> start.ps1
echo "cd $($pwd)\backend\" >> start.ps1
echo '$server_process = Start-Process -PassThru -NoNewWindow -FilePath "node" -ArgumentList "--experimental-modules index.js"' >> start.ps1


echo 'echo $server_process' >> start.ps1


echo "cd .." >> start.ps1
$start_script_location = "$($pwd)\Blockly-for-Dwenguino\index.html"
$command_p1 = '$frontend_process = Start-Process -PassThru -WindowStyle Hidden -FilePath "powershell" -ArgumentList "electron","'
$command_p2 = '","--no-sandbox"'
echo "$($command_p1)$($start_script_location)$($command_p2)" >> start.ps1
  
echo 'echo $frontend_process' >> start.ps1
echo 'echo "waiting for frontend process to finish"' >> start.ps1
echo 'Wait-Process -Id $frontend_process.id' >> start.ps1

echo "# Stop server and database server" >> start.ps1
echo '"echo Stopping servers"' >> start.ps1
echo 'Stop-Process $server_process' >> start.ps1
echo 'Stop-Process $database_process' >> start.ps1


echo "creating desktop shortcut"
$DestinationPath = "$HOME\Desktop\DwenguinoBlockly.lnk"
$SourceExe = "powershell"
$Arguments = "$($pwd)\start.ps1 -noprofile -executionpolicy bypass"
$WorkingDir = "$($pwd)"
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($DestinationPath)
$Shortcut.Arguments = $Arguments
$Shortcut.TargetPath = $SourceExe
$Shortcut.WorkingDirectory = $WorkingDir
$Shortcut.Save()


echo "Installing chocolatey windows package manager"
choco -v
If (-not $?){
  Set-ExecutionPolicy Bypass -Scope Process -Force;
  Invoke-Expression "powershell $($pwd)\install_chocolatey.ps1"
  choco -v
  If (-not $?){
    echo "chocolatey failed to install, did you run the script in admin mode?"
    exit 1
  }
}


echo "Installing make"
choco install make -y

