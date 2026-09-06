@echo off
setlocal
cd /d "%~dp0"
call npm run typecheck || exit /b 1
call npm run lint || exit /b 1
call npm run test || exit /b 1
call npm run build || exit /b 1
echo BLACKLIGHT verification passed.
