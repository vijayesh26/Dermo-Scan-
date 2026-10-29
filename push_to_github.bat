@echo off
setlocal
echo =========================================================================
echo  Pushing DermoScan to GitHub Repository:
echo  https://github.com/vijayesh26/Dermo-Scan-.git
echo =========================================================================
echo.

cd /d "%~dp0"

REM Ensure git is available in PATH for this session
if exist "%LOCALAPPDATA%\Programs\MinGit\cmd\git.exe" (
    set "PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%PATH%"
)

git remote set-url origin https://github.com/vijayesh26/Dermo-Scan-.git
git branch -M main

echo Executing: git push -u origin main
echo (If prompted, please authenticate with your GitHub account)
echo.

git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo -------------------------------------------------------------------------
    echo  Push encountered an authentication or conflict check.
    echo  If your GitHub repo already has an existing README or license file on remote,
    echo  you can push with force by running:
    echo    git push -u origin main --force
    echo -------------------------------------------------------------------------
) else (
    echo.
    echo =========================================================================
    echo  SUCCESS: All files successfully pushed to GitHub!
    echo =========================================================================
)

echo.
pause
