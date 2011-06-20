@echo off

set ANT_BIN=d:\ourtools\ant\bin\ant.bat

if not exist "%ANT_BIN%" goto NO_ANT
if not exist "build.xml" goto NO_BUILD

call %ANT_BIN%
GOTO END

:NO_ANT
	echo.
	echo **** 请安装 ant 后再运行
	echo.
    goto END

:NO_BUILD
    echo.
	echo **** 该目录下没有找到 build.xml 文件
	echo.
    
:END
    pause
