@echo off
setlocal enabledelayedexpansion

echo =========================================================================
echo       DERMOSCAN - 1-CLICK GITHUB REPOSITORY PUSHER
echo       Target: https://github.com/vijayesh26/Dermo-Scan-.git
echo =========================================================================
echo.

cd /d "%~dp0"

REM Ensure Git and GitHub CLI are in PATH
if exist "%LOCALAPPDATA%\Programs\MinGit\cmd\git.exe" (
    set "PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%PATH%"
)
if exist "%LOCALAPPDATA%\Programs\gh" (
    set "PATH=%LOCALAPPDATA%\Programs\gh;%PATH%"
)

REM Check GitHub CLI authentication status
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] You are not currently logged in to GitHub.
    echo.
    echo A secure GitHub sign-in will now open in your browser...
    echo (Press Enter on the prompts and approve in your web browser)
    echo.
    gh auth login -h github.com -p https -w
    if %errorlevel% neq 0 (
        echo.
        echo Login was not completed. Please try again.
        pause
        exit /b 1
    )
    echo.
    echo [✓] Successfully authenticated with GitHub!
    echo.
)

REM Setup git credential helper using GitHub CLI
gh auth setup-git

REM Ensure remote and branch are configured
git remote set-url origin https://github.com/vijayesh26/Dermo-Scan-.git
git branch -M main

echo.
echo Pushing project to https://github.com/vijayesh26/Dermo-Scan-.git ...
echo.

git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [!] Standard push was rejected (likely because the remote repo has an initial commit).
    echo Attempting force push to overwrite with the full DermoScan project...
    echo.
    git push -u origin main --force
)

if %errorlevel% equ 0 (
    echo.
    echo =========================================================================
    echo  [SUCCESS] All project files are now LIVE on your GitHub repository!
    echo  View it at: https://github.com/vijayesh26/Dermo-Scan-
    echo =========================================================================
) else (
    echo.
    echo [X] Push failed. Please verify your internet connection or repository permissions.
)

echo.
pause
