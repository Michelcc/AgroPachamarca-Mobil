# Borra caches nativas con rutas antiguas (ejecutar antes de Run en Android Studio)
$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $root

function Remove-BuildTree($path) {
  if (Test-Path $path) {
    Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Limpiado: $path"
  }
}

foreach ($dir in @("android\app\.cxx", "android\app\build", "android\.gradle", "android\build")) {
  Remove-BuildTree $dir
}

Get-ChildItem -Path "node_modules" -Directory -Recurse -Filter ".cxx" -ErrorAction SilentlyContinue |
  ForEach-Object { Remove-BuildTree $_.FullName }

Get-ChildItem -Path "node_modules" -Directory -Recurse -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -eq "build" -and $_.Parent.Name -eq "android" } |
  ForEach-Object { Remove-BuildTree $_.FullName }

Write-Host "Listo. Abre C:\m\android en Android Studio (ejecuta abrir-studio.ps1 si C:\m no existe)." -ForegroundColor Green
