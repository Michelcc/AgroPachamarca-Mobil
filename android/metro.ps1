# Inicia Metro para cuando ejecutas la app desde Android Studio (Run)
$ErrorActionPreference = "Stop"
$androidDir = $PSScriptRoot
$mobileRoot = (Resolve-Path (Join-Path $androidDir "..")).Path
$shortRoot = "C:\m"

if (-not (Test-Path $shortRoot)) {
  cmd /c mklink /J $shortRoot $mobileRoot | Out-Null
  Write-Host "Ruta corta: $shortRoot -> $mobileRoot" -ForegroundColor DarkGray
}

Set-Location $shortRoot

$adb = Join-Path $env:LOCALAPPDATA "Android\Sdk\platform-tools\adb.exe"
if (Test-Path $adb) {
  & $adb reverse tcp:8081 tcp:8081 2>$null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "adb reverse tcp:8081 tcp:8081 (telefono USB)" -ForegroundColor DarkGray
  }
} else {
  Write-Host "adb no encontrado; en emulador suele bastar con Metro en el PC." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Metro en http://localhost:8081" -ForegroundColor Cyan
Write-Host "1. Deja esta ventana abierta" -ForegroundColor White
Write-Host "2. En Android Studio pulsa Run (o Reload en el movil)" -ForegroundColor White
Write-Host ""

npx expo start
