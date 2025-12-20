@echo off
echo Allowing network access for Node.js development server...
netsh advfirewall firewall add rule name="Node.js Dev Server" dir=in action=allow protocol=TCP localport=5000
echo Network access enabled for port 5000
echo.
echo Mobile devices can now access the application at:
echo http://192.168.8.100:5000
echo.
echo To remove this rule later, run:
echo netsh advfirewall firewall delete rule name="Node.js Dev Server"
pause