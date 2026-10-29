while ($true) {
    Write-Host "Connecting tunnel..."
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -R 80:127.0.0.1:3000 nokey@localhost.run
    Start-Sleep -Seconds 3
}
