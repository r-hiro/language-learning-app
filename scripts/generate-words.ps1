$ErrorActionPreference = "Stop"

$root = if ($PSScriptRoot) { Split-Path -Parent $PSScriptRoot } else { (Get-Location).Path }
$dataDir = Join-Path $root "data"
$jsonPath = Join-Path $dataDir "words.json"
$jsPath = Join-Path $dataDir "words.js"

if (-not (Test-Path $jsonPath)) {
  throw "words.json が見つかりません: $jsonPath"
}

$json = Get-Content -Raw -Encoding UTF8 $jsonPath
$null = $json | ConvertFrom-Json

Set-Content -Encoding UTF8 -Path $jsPath -Value "window.WORD_DATA = $json;"
Write-Host "Generated: $jsPath"
