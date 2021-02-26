@echo off
SETLOCAL disabledelayedexpansion
call:autoPush %1
pause
goto:eof


:autoPush
SETLOCAL disabledelayedexpansion
set message=%1
if "%~1"=="" (
    call:error
    goto:eof
)
set startwith=%message:~0,1%
set endwith=%message:~-1%
if %startwith%%endwith%=="" (
    git config --local user.name weidehai
    git config --local user.email 243395655@qq.com
    git add .
    git commit -m "%~1"
    git push origin HEAD:weidehai-patch-1
) else (
    call:error
)
ENDLOCAL
goto:eof


:error
SETLOCAL disabledelayedexpansion
echo please input commit message with double quote[e.g. pushgit "message"]
ENDLOCAL
goto:eof