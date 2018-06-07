
@echo off
:: 设置压缩JS文件的根目录，脚本会自动按树层次查找和压缩所有的JS
cd  %~dp0
SET JSFOLDER=%~dp0
setlocal enabledelayedexpansion
set classpath=
for %%c in (*.js) do @set classpath=!classpath! %%c
set classpath=testdev %classpath% output.js
%classpath%
echo %classpath%
pause;