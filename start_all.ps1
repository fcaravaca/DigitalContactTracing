$env:DCT_HTTPS="false"
echo $env:DCT_HTTPS > .\src\Health_authority\https.env

cd .\src\ID_Provider
.\start_idp.bat
cd ..\ITP_Authority
.\start_itpa.bat
cd ..\Location_Provider
.\start_lps.bat
cd ..\..
