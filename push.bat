@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo     开始推送 wy-TpTest 到 GitHub
echo ========================================
echo.

REM 检查 Git 是否已安装
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未找到 Git 命令，请先安装 Git 并添加到环境变量。
    pause
    exit /b 1
)

REM 设置 Git 用户信息（如果未配置全局，则设置临时信息）
git config user.name >nul 2>nul
if %errorlevel% neq 0 (
    echo [信息] 设置临时 Git 用户名...
    git config user.name "Your Name"
)
git config user.email >nul 2>nul
if %errorlevel% neq 0 (
    echo [信息] 设置临时 Git 邮箱...
    git config user.email "your.email@example.com"
)

REM 检查当前目录是否为 Git 仓库，如果不是则初始化
if not exist ".git" (
    echo [信息] 初始化 Git 仓库...
    git init
    if !errorlevel! neq 0 (
        echo [错误] 初始化失败。
        pause
        exit /b 1
    )
)

REM 设置远程仓库（如果已存在则更新 URL）
echo [信息] 检查远程仓库配置...
git remote get-url origin >nul 2>nul
if !errorlevel! neq 0 (
    echo [信息] 添加远程仓库 origin...
    git remote add origin https://github.com/Hzh325/TPTest.git
) else (
    echo [信息] 更新远程仓库 URL...
    git remote set-url origin https://github.com/Hzh325/TPTest.git
)

REM 添加所有文件（包括新增、修改、删除）
echo [信息] 添加所有文件到暂存区...
git add --all
if !errorlevel! neq 0 (
    echo [错误] 添加文件失败。
    pause
    exit /b 1
)

REM 提交更改
echo [信息] 提交更改...
git commit -m "自动提交：更新所有文件"
if !errorlevel! neq 0 (
    echo [信息] 提交失败或没有更改，尝试查看状态...
    git status
) else (
    echo [信息] 提交成功。
)

REM 检查是否存在 main 分支（或 master），如果不存在则创建
git show-ref --verify --quiet refs/heads/main
if !errorlevel! neq 0 (
    echo [信息] main 分支不存在，创建 main 分支...
    git checkout -b main
    if !errorlevel! neq 0 (
        echo [错误] 创建 main 分支失败。
        pause
        exit /b 1
    )
)

REM 强制推送到远程 main 分支
echo [信息] 开始强制推送至 GitHub (origin main)...
git push -f origin main
if !errorlevel! neq 0 (
    echo [错误] 推送失败，请检查网络或仓库权限。
    pause
    exit /b 1
)

echo.
echo ========================================
echo       推送完成！远程仓库已同步。
echo ========================================
pause