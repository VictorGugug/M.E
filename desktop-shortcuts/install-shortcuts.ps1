$desktop = [Environment]::GetFolderPath("Desktop")
# Create internet shortcut on Desktop
$urlPath = Join-Path $desktop "alanxd_qneszar.url"
$urlContent = "[InternetShortcut]`nURL=https://alanxd.my.canva.site/qneszar`nIconFile=`nIconIndex=0"
Set-Content -Path $urlPath -Value $urlContent -Encoding ASCII

# Copy Guion.docx to Desktop
$source = "D:\A-TODO\CODIGOS\M.E\XP ALL\Guion.docx"
#$dest = Join-Path $desktop "Guion.docx"
$dest = Join-Path $desktop "Guion.docx"
if (Test-Path $source) {
    Copy-Item -Path $source -Destination $dest -Force
    Write-Host "Copiado Guion.docx a $dest"
} else {
    Write-Host "No se encontró el archivo fuente: $source"
}

# Create a .bat on Desktop to open the copied file with Notepad
$batPath = Join-Path $desktop "Abrir Guion con Bloc de notas.bat"
$batContent = "@echo off`r`nstart \"\" notepad \"%USERPROFILE%\Desktop\Guion.docx\"`
"
Set-Content -Path $batPath -Value $batContent -Encoding ASCII

Write-Host "Atajos creados en: $desktop"
