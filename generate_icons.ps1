# Check if ImageMagick is installed
$imageMagick = Get-Command magick -ErrorAction SilentlyContinue

if (-not $imageMagick) {
    Write-Host "ImageMagick is not installed. Please install it first using:"
    Write-Host "winget install ImageMagick.ImageMagick"
    Write-Host "or visit https://imagemagick.org/script/download.php#windows"
    exit
}

# Create icons directory if it doesn't exist
if (-not (Test-Path -Path "icons")) {
    New-Item -ItemType Directory -Path "icons"
}

# Generate 128x128 icon
magick -size 128x128 xc:transparent `
    -fill "#4285f4" -draw "roundrectangle 10,10 118,118 10,10" `
    -fill white -pointsize 60 -gravity center -draw "text 0,0 'URL'" `
    -fill "#357abd" -draw "circle 95,95 95,115" `
    -fill white -draw "rectangle 85,85 115,90" `
    icons/icon128.png

# Generate 48x48 icon
magick icons/icon128.png -resize 48x48 icons/icon48.png

# Generate 16x16 icon
magick icons/icon128.png -resize 16x16 icons/icon16.png

Write-Host "Icons generated successfully in the 'icons' directory!" 