:: add script to enviroment.
@echo off
rem 声明采用UTF-8编码
chcp 65001
color 0a
set will_set_dep_path=
set expect_dep_path=%~dp0script,%~dp0script\complie-sass,%~dp0script\complie-autoprefixer,%~dp0script\complie-ts
set node_bin_path=%~dp0extension-tools\node_modules\.bin
call:setPath
set expect_dep_path=
set node_bin_path=
pause
color 0f
goto:eof

:setPath
set wone_depdir=%~dp0
set wone_project_path=%wone_depdir:~,-11%
echo 项目根路径:%wone_project_path%
echo 项目依赖:%wone_depdir%
echo 检查是否存在重复的环境变量
for %%i in (%expect_dep_path%) do (
    call:checkDuplicatePath %%i
)
call:setNodeBinPath
if "%will_set_dep_path%"=="" (
    echo 没有新增的环境变量
    goto:eof
)
set Path=%will_set_dep_path%;%Path%
goto:eof

:checkDuplicatePath
echo "%Path%" | findstr /l %~1 >nul && (
    echo 环境变量已存在:%~1
) || (
    if defined will_set_dep_path (
        set will_set_dep_path=%~1;%will_set_dep_path%
    ) else (
        set will_set_dep_path=%~1
    )
)
goto:eof

:setNodeBinPath
echo "%Path%" | findstr /l %~dp0extension-tools\node_modules\ >nul && (
    echo 环境变量已存在:%~dp0extension-tools\node_modules\.bin
) || (
    if defined will_set_dep_path (
        set will_set_dep_path=%node_bin_path%;%will_set_dep_path%
    ) else (
        set will_set_dep_path=%node_bin_path%
    )
)
goto:eof