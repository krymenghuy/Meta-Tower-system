@ECHO OFF

> openssl req -x509 -days 365 -newkey rsa:2048 -keyout private-key.pem -out certificate.pem
> openssl pkcs12 -export -in certificate.pem -inkey private-key.pem -out dms_cert.pfx
> openssl pkcs12 -in dms_cert.pfx -clcerts -nokeys -out public-key.pem

PAUSE