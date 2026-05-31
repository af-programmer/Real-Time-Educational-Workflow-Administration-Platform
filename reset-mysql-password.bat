@echo off
setlocal
echo ================================================
echo  EduFlow - MySQL Password Reset (Run as Admin!)
echo ================================================
echo.

set MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 9.7\bin
set MYINI=C:\ProgramData\MySQL\MySQL Server 9.7\my.ini
set NEW_PASSWORD=A1B2C3D4

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Right-click and "Run as Administrator"
    pause & exit /b 1
)

echo [1] Stopping MySQL service...
net stop MySQL97 >nul 2>&1
timeout /t 4 /nobreak >nul

echo [2] Starting mysqld directly with --skip-grant-tables and --enable-named-pipe...
start "MySQL-Reset" "%MYSQL_BIN%\mysqld.exe" ^
  --defaults-file="%MYINI%" ^
  --skip-grant-tables ^
  --enable-named-pipe ^
  --console

echo Waiting 10 seconds for mysqld to start...
timeout /t 10 /nobreak >nul

echo [3] Connecting via named pipe to reset password...
"%MYSQL_BIN%\mysql.exe" -u root --protocol=pipe -e "FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY '%NEW_PASSWORD%'; FLUSH PRIVILEGES;" 2>&1

echo [4] Stopping the temporary mysqld process...
taskkill /F /IM mysqld.exe >nul 2>&1
timeout /t 4 /nobreak >nul

echo [5] Starting MySQL service normally...
net start MySQL97
timeout /t 5 /nobreak >nul

echo.
echo [6] Testing connection with new password...
"%MYSQL_BIN%\mysql.exe" -u root -p%NEW_PASSWORD% -e "SELECT 'SUCCESS!' AS result, VERSION() AS mysql_version;" 2>&1

echo.
echo ================================================
echo If you see SUCCESS above - done! Now run:
echo   node database/init.js
echo ================================================
pause
