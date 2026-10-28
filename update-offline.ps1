$ErrorActionPreference = 'Stop'
$folder = Split-Path -Parent $MyInvocation.MyCommand.Path
$inputFile = Join-Path $folder 'data\influencer.json'
$outputFile = Join-Path $folder 'data\offline-data.js'
try {
    $json = [System.IO.File]::ReadAllText($inputFile,[System.Text.Encoding]::UTF8)
    $null = ConvertFrom-Json -InputObject $json
    $prefix = '/* Generated from data/influencer.json. Edit JSON, not this file. */' + "`r`n" + 'window.RAUSHAN_PORTFOLIO_DATA = '
    $output = $prefix + $json.Trim() + ';' + "`r`n"
    [System.IO.File]::WriteAllText($outputFile,$output,[System.Text.UTF8Encoding]::new($false))
    Write-Host 'SUCCESS! You can now refresh index.html.' -ForegroundColor Green
} catch {
    Write-Host ('ERROR: ' + $_.Exception.Message) -ForegroundColor Red
    exit 1
}
