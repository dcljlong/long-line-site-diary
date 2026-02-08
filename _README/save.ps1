Set-Location "D:\long-line-site-diary"

$stamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$dest  = "D:\long-line-site-diary\backups\session_$stamp"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
robocopy "." "$dest\repo" /E /NFL /NDL /NJH /NJS | Out-Null
Write-Host "Backup: $dest"

git add .
git commit -m "Session save $stamp"
git push
git status
