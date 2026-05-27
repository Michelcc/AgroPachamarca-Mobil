# Enlace C:\m y abre Android Studio (ruta corta, compatible con Gradle)
$ErrorActionPreference = "Stop"
$mobileRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$shortRoot = "C:\m"

if (-not (Test-Path $shortRoot)) {
  cmd /c mklink /J $shortRoot $mobileRoot | Out-Null
  Write-Host "Ruta corta: $shortRoot -> $mobileRoot" -ForegroundColor DarkGray
}

$studio = "${env:ProgramFiles}\Android\Android Studio\bin\studio64.exe"
$project = "$shortRoot\android"
if (-not (Test-Path $studio)) {
  Write-Host "Abre manualmente en Android Studio: $project" -ForegroundColor Yellow
  exit 0
}
Start-Process $studio -ArgumentList $project
