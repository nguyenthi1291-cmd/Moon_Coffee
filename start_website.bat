@echo off
chcp 65001 > nul
title XANH VỊ QUÁN - Hệ Thống Bán Hàng & Thanh Toán VietQR
echo ==============================================================
echo       KHỞI CHẠY HỆ THỐNG XANH VỊ QUÁN (THỨC UỐNG & BẾP NHÀ)
echo ==============================================================
echo Đang mở website trên trình duyệt mặc định của bạn...
echo.

:: Mở trực tiếp file index.html qua trình duyệt mặc định
start "" "%~dp0index.html"

echo [OK] Đã mở thành công!
echo Bạn cũng có thể khởi chạy server cục bộ bằng cách:
echo Chuột phải vào file server.ps1 -> Run with PowerShell
echo ==============================================================
timeout /t 5 > nul
