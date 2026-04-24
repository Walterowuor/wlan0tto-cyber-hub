# Create css directory if it doesn't exist
New-Item -ItemType Directory -Path "css" -Force

# Download Tailwind CSS minified version
$url = "https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"
$output = "css/tailwind.min.css"
Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "Tailwind CSS downloaded successfully to $output" 