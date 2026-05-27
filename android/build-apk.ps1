# Genera APK release (JavaScript embebido, NO requiere Metro en el telefono)
$ErrorActionPreference = "Stop"
$androidDir = $PSScriptRoot
$mobileRoot = (Resolve-Path (Join-Path $androidDir "..")).Path

$envFile = Join-Path $androidDir ".env"
if (-not (Test-Path $envFile)) {
  Write-Host "Aviso: no hay android\.env - el APK compilara sin claves Supabase." -ForegroundColor Yellow
}

Set-Location $mobileRoot

$javaHome = "C:\Program Files\Android\Android Studio\jbr"
$androidHome = Join-Path $env:LOCALAPPDATA "Android\Sdk"
if (Test-Path $javaHome) { $env:JAVA_HOME = $javaHome }
if (Test-Path $androidHome) {
  $env:ANDROID_HOME = $androidHome
  $env:PATH = "$env:JAVA_HOME\bin;$androidHome\platform-tools;$env:PATH"
}

$localProps = Join-Path $mobileRoot "android\local.properties"
if (-not (Test-Path $localProps) -and (Test-Path $androidHome)) {
  $escaped = $androidHome -replace "\\", "\\\\"
  "sdk.dir=$escaped" | Set-Content $localProps -Encoding ASCII
}

if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
      [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), "Process")
    }
  }
}

if (-not (Test-Path "node_modules")) { npm install }
node (Join-Path $mobileRoot "scripts\patch-supabase-hermes.js")

Write-Host "Generando APK con JavaScript incluido (sin Metro, varios minutos)..." -ForegroundColor Cyan
Set-Location (Join-Path $mobileRoot "android")
Remove-Item "app\build\generated\assets" -Recurse -Force -ErrorAction SilentlyContinue
.\gradlew.bat assembleRelease --no-daemon

$apk = Join-Path $mobileRoot "android\app\build\outputs\apk\release\app-release.apk"
if (-not (Test-Path $apk)) {
  Write-Host "No se encontro el APK." -ForegroundColor Red
  exit 1
}

$dest = Join-Path $mobileRoot "agro-release.apk"
Copy-Item $apk $dest -Force

Write-Host ""
Write-Host "APK listo:" -ForegroundColor Green
Write-Host "  $dest"
Write-Host ""
Write-Host "Instalar: adb install -r `"$dest`"" -ForegroundColor Cyan
