# Copy favicon files to root directory
Copy-Item -Path "assets/icons/favicon.ico" -Destination "favicon.ico" -Force
Copy-Item -Path "assets/icons/favicon-16.ico" -Destination "favicon-16.ico" -Force
Copy-Item -Path "assets/icons/favicon-64.ico" -Destination "favicon-64.ico" -Force

Write-Host "Favicon files copied successfully to root directory" 