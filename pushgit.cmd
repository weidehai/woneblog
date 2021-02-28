@echo off
SETLOCAL disabledelayedexpansion
for /f "delims=" %%i in ('git name-rev --name-only HEAD') do (set current_branch=%%i)
call:autoPush %1 %current_branch%
pause
ENDLOCAL
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
    git push origin %2 && echo "success" || git reset HEAD~ && echo "push fail and reset commit"
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