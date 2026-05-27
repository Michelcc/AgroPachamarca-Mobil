# Genera APK con JS incluido e instala en el telefono (sin Metro)
$ErrorActionPreference = "Stop"
$androidDir = $PSScriptRoot
$mobileRoot = (Resolve-Path (Join-Path $androidDir "..")).Path
$packageId = "com.agro"

& (Join-Path $androidDir "build-apk.ps1")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$apk = Join-Path $mobileRoot "agro-release.apk"
$adb = Join-Path $env:LOCALAPPDATA "Android\Sdk\platform-tools\adb.exe"

if (-not (Test-Path $adb)) {
  Write-Host "Copia el APK al movil: $apk" -ForegroundColor Yellow
  exit 0
}

$devices = & $adb devices 2>$null | Select-String "device$"
if (-not $devices) {
  Write-Host "Sin dispositivo USB. Copia al movil: $apk" -ForegroundColor Yellow
  exit 0
}

Write-Host "Desinstalando version anterior..." -ForegroundColor DarkGray
& $adb uninstall $packageId 2>$null | Out-Null

Write-Host "Instalando..." -ForegroundColor Cyan
& $adb install -r $apk
if ($LASTEXITCODE -eq 0) {
  Write-Host "Listo. Abre Agro (sin Metro)." -ForegroundColor Green
} else {
  Write-Host "Error. Prueba: adb install -r `"$apk`"" -ForegroundColor Red
}
