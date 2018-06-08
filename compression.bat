
@echo off
cd  %~dp0
setlocal enabledelayedexpansion
set classpath=
for %%c in (*.js) do @set classpath=!classpath! %%c 
 uglifyjs %classpath% -o output.js && base62 output.js -c mapsuite-vectormap.js && del output.js

