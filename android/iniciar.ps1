# Compila con ruta corta C:\m (evita rutas > 260 caracteres en Windows)
$ErrorActionPreference = "Stop"
$androidDir = $PSScriptRoot
$mobileRoot = (Resolve-Path (Join-Path $androidDir "..")).Path
$shortRoot = "C:\m"

$envFile = Join-Path $androidDir ".env"
if (-not (Test-Path $envFile)) {
  Write-Host "Crea android\.env desde android\.env.example (Supabase)." -ForegroundColor Red
  exit 1
}

# Enlace C:\m -> carpeta mobile (no usar subst P:; rompe autolinking de Expo)
if (-not (Test-Path $shortRoot)) {
  cmd /c mklink /J $shortRoot $mobileRoot | Out-Null
  Write-Host "Ruta corta: $shortRoot -> $mobileRoot" -ForegroundColor DarkGray
} else {
  $item = Get-Item $shortRoot -Force
  if ($item.LinkType -ne "Junction" -or $item.Target -notcontains $mobileRoot) {
    Write-Host "$shortRoot existe y no apunta a $mobileRoot" -ForegroundColor Red
    Write-Host "Borra o renombra $shortRoot y vuelve a ejecutar." -ForegroundColor Red
    exit 1
  }
}

$workRoot = $shortRoot
Set-Location $workRoot

$javaHome = "C:\Program Files\Android\Android Studio\jbr"
$androidHome = Join-Path $env:LOCALAPPDATA "Android\Sdk"
if (Test-Path $javaHome) { $env:JAVA_HOME = $javaHome }
if (Test-Path $androidHome) {
  $env:ANDROID_HOME = $androidHome
  $env:PATH = "$env:JAVA_HOME\bin;$androidHome\platform-tools;$env:PATH"
}

$localProps = Join-Path $workRoot "android\local.properties"
if (-not (Test-Path $localProps) -and (Test-Path $androidHome)) {
  $escaped = $androidHome -replace "\\", "\\\\"
  "sdk.dir=$escaped" | Set-Content $localProps -Encoding ASCII
  Write-Host "Creado android\local.properties" -ForegroundColor DarkGray
}

Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
    [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), "Process")
  }
}

if (-not (Test-Path "node_modules")) { npm install }

function Remove-BuildTree($path) {
  if (Test-Path $path) {
    Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Limpiado: $path" -ForegroundColor DarkGray
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

Write-Host "Compilando desde $workRoot ..." -ForegroundColor Cyan
npx expo run:android
