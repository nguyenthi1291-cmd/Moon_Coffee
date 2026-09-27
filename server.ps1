# =====================================================================
# Lightweight Local Web Server for Xanh Vị Quán (Pure PowerShell / .NET)
# Không yêu cầu cài đặt Node.js hay Python. Chạy trực tiếp trên Windows 10/11!
# =====================================================================

$port = 8080
$url = "http://localhost:$port/"
$rootPath = $PSScriptRoot

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   TIỆM NƯỚC & BẾP NHÀ - XANH VỊ QUÁN (LOCAL SERVER)      " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " [i] Đang khởi động máy chủ tại: $url" -ForegroundColor Yellow
Write-Host " [i] Thư mục gốc: $rootPath" -ForegroundColor Gray
Write-Host " [!] Nhấn Ctrl + C để dừng máy chủ" -ForegroundColor DarkGray
Write-Host "==========================================================" -ForegroundColor Cyan

# Mở trình duyệt mặc định
Start-Process $url

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($rawPath)) {
            $rawPath = "index.html"
        }

        # Giải mã URL
        $decodedPath = [System.Uri]::UnescapeDataString($rawPath).Replace('/', '\')
        $filePath = Join-Path $rootPath $decodedPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $contentType

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            $notFoundMsg = [System.Text.Encoding]::UTF8.GetBytes("404 - Không tìm thấy tệp: $rawPath")
            $response.OutputStream.Write($notFoundMsg, 0, $notFoundMsg.Length)
        }

        $response.OutputStream.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
