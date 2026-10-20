# Project-local LibreOffice runtime, extracted from the official signed installer.
# This administrative extraction does not install Office or change file associations.
$ErrorActionPreference = 'Stop'
$previewWorkspace = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$previewTools = Join-Path $previewWorkspace '.tools'
$previewRuntime = Join-Path $previewTools 'libreoffice'
$previewInstaller = Join-Path $previewTools 'LibreOffice_26.2.6_Win_x86-64.msi'
$previewHash = 'f9877032fd908beb9c0ddf06df4af5c2e85f419c42e14876c4cce5aae5fb2660'
New-Item -ItemType Directory -Path $previewTools -Force | Out-Null
if (!(Test-Path -LiteralPath $previewInstaller)) {
  Invoke-WebRequest -Uri 'https://download.documentfoundation.org/libreoffice/stable/26.2.6/win/x86_64/LibreOffice_26.2.6_Win_x86-64.msi' -OutFile $previewInstaller
}
if ((Get-FileHash -LiteralPath $previewInstaller -Algorithm SHA256).Hash.ToLowerInvariant() -ne $previewHash) {
  throw 'Checksum runtime LibreOffice tidak sesuai. Berkas tidak dieksekusi.'
}
if (!(Test-Path -LiteralPath (Join-Path $previewRuntime 'program/soffice.com'))) {
  $previewLog = Join-Path $previewTools 'libreoffice-extract.log'
  $previewArguments = @('/a', "`"$previewInstaller`"", '/qn', "TARGETDIR=`"$previewRuntime`"", "INSTALLLOCATION=`"$previewRuntime`"", '/l*v', "`"$previewLog`"")
  $previewExtraction = Start-Process -FilePath msiexec.exe -ArgumentList $previewArguments -WindowStyle Hidden -PassThru -Wait
  if ($previewExtraction.ExitCode -ne 0) { throw "Ekstraksi gagal ($($previewExtraction.ExitCode)). Lihat $previewLog" }
}
$previewExecutable = Get-ChildItem -LiteralPath $previewRuntime -Filter soffice.com -File -Recurse | Select-Object -First 1
if (!$previewExecutable) { throw 'Executable LibreOffice belum ditemukan.' }
$previewProfile = Join-Path $previewTools 'preview-profile'
if (!(Test-Path -LiteralPath (Join-Path $previewProfile 'user/registrymodifications.xcu'))) {
  Write-Output 'Menyiapkan profil mesin pratinjau sekali sebelum menerima dokumen.'
  $previewSeed = Join-Path $previewTools 'preview-seed.rtf'
  '{\rtf1\ansi SINTESA preview initialization}' | Set-Content -LiteralPath $previewSeed -Encoding ASCII
  $previewProfileUri = ([Uri]$previewProfile).AbsoluteUri
  $previewWarmArgs = @("-env:UserInstallation=$previewProfileUri", '--headless', '--nologo', '--norestore', '--convert-to', 'pdf', '--outdir', "`"$previewTools`"", "`"$previewSeed`"")
  $previewWarm = Start-Process -FilePath $previewExecutable.FullName -ArgumentList $previewWarmArgs -WindowStyle Hidden -PassThru
  if (!$previewWarm.WaitForExit(240000)) {
    & taskkill.exe /pid $previewWarm.Id /t /f | Out-Null
    throw 'Profil belum selesai disiapkan. Coba jalankan setup lagi.'
  }
  if ($previewWarm.ExitCode -ne 0 -or !(Test-Path -LiteralPath (Join-Path $previewTools 'preview-seed.pdf'))) { throw 'Inisialisasi profil pratinjau gagal.' }
}
@{ executable = $previewExecutable.FullName; version = '26.2.6' } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $previewTools 'preview-runtime.json') -Encoding UTF8
Write-Output "Runtime pratinjau siap: $($previewExecutable.FullName)"
