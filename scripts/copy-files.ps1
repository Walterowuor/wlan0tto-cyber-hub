# Create destination directories
$destDir = "C:\Users\Wzzard\Desktop\wlan0tto-cyber-hub-v2"
New-Item -ItemType Directory -Path "$destDir\js\components" -Force
New-Item -ItemType Directory -Path "$destDir\css" -Force
New-Item -ItemType Directory -Path "$destDir\assets\icons" -Force

# Copy files
Copy-Item "index.html" -Destination "$destDir\"
Copy-Item "js\app.js" -Destination "$destDir\js\"
Copy-Item "js\components\ServiceManager.js" -Destination "$destDir\js\components\"
Copy-Item "js\components\UIManager.js" -Destination "$destDir\js\components\"
Copy-Item "css\styles.css" -Destination "$destDir\css\"
Copy-Item "services.json" -Destination "$destDir\"
Copy-Item "manifest.json" -Destination "$destDir\"
Copy-Item "sw.js" -Destination "$destDir\"
Copy-Item "privacy.html" -Destination "$destDir\"
Copy-Item "favicon.ico" -Destination "$destDir\assets\icons\"
Copy-Item "favicon-16.ico" -Destination "$destDir\assets\icons\"
Copy-Item "favicon-64.ico" -Destination "$destDir\assets\icons\"
Copy-Item "README.md" -Destination "$destDir\"

Write-Host "Files copied successfully to $destDir" 