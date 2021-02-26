:: add script to enviroment.
@echo off
color 0a
call:setEnv
pause
color 0f
goto:eof

:setEnv
set wone_depdir=%~dp0
set wone_project_path=%wone_depdir:~,-11%
echo %wone_project_path%
echo %wone_depdir%
set Path=%~dp0\script;%~dp0\script\complie_sass;%Path%
goto:eof
