# PowerShell script to download API data and save as JSON files
# Downloads from https://api.pigofpigs.com/game/1 through 140

# Create output directory if it doesn't exist
$outputDir = "./scraped"
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
    Write-Host "Created directory: $outputDir" -ForegroundColor Green
}

# Base URL
$baseUrl = "https://api.pigofpigs.com/game"

# Counter for progress tracking
$completed = 0
$total = 140

Write-Host "Starting download of $total JSON files..." -ForegroundColor Cyan

# Loop through IDs 1 to 140
for ($i = 1; $i -le 140; $i++) {
    try {
        # Construct URL
        $url = "$baseUrl/$i"
        
        # Construct output filename (zero-padded for better sorting)
        $filename = "game_{0:D3}.json" -f $i
        $filepath = Join-Path $outputDir $filename
        
        # Download the data
        Write-Progress -Activity "Downloading API data" -Status "Processing $url" -PercentComplete (($completed / $total) * 100)
        
        $response = Invoke-RestMethod -Uri $url -Method Get -ContentType "application/json"
        
        # Convert to pretty JSON and save to file
        $response | ConvertTo-Json -Depth 10 | Out-File -FilePath $filepath -Encoding UTF8
        
        $completed++
        Write-Host "Downloaded: $filename" -ForegroundColor Green
        
        # Small delay to be respectful to the API
        Start-Sleep -Milliseconds 100
        
    } catch {
        Write-Warning "Failed to download $url : $($_.Exception.Message)"
        # Continue with next file even if one fails
        continue
    }
}

Write-Progress -Activity "Downloading API data" -Completed
Write-Host "`nDownload completed! $completed out of $total files downloaded successfully." -ForegroundColor Cyan
Write-Host "Files saved to: $(Resolve-Path $outputDir)" -ForegroundColor Yellow
