@echo off

set ANT_BIN=d:\ourtools\ant\bin\ant.bat

if not exist "%ANT_BIN%" goto NO_ANT
if not exist "build.xml" goto NO_BUILD

call %ANT_BIN%
GOTO END

:NO_ANT
	echo.
	echo **** �밲װ ant ��������
	echo.
    goto END

:NO_BUILD
    echo.
	echo **** ��Ŀ¼��û���ҵ� build.xml �ļ�
	echo.
    
:END
    pause
