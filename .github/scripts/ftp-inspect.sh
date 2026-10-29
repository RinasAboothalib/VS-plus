#!/usr/bin/env bash
# Reports, as run annotations, which build each candidate folder on the FTP login holds
# and which build visualstudiosplus.com serves, so the folder the site is served from is
# plain to see. Usage: ftp-inspect.sh <label>   (env: S, U, P = FTP server, user, password)
#
# Hostinger's FTP certificate is issued for *.hstgr.io: connect to the server's IP but
# check the certificate against that name, so TLS stays fully verified.
set -uo pipefail
label="$1"
ip="${S#ftp://}"; ip="${ip%%/*}"; ip="${ip//[[:space:]]/}"
ftp() { curl -sS --max-time 30 --ssl-reqd --connect-to "ftp.hstgr.io:21:$ip:21" --user "$U:$P" "$@"; }
bundle() { grep -oE '/assets/index-[A-Za-z0-9_-]+\.js' | head -1; }

for path in index.html public_html/index.html domains/visualstudiosplus.com/public_html/index.html; do
	url="ftp://ftp.hstgr.io/$path"
	when=$(ftp -I "$url" 2>/dev/null | tr -d '\r' | sed -n 's/^Last-Modified: //p')
	built=$(ftp "$url" 2>/dev/null | bundle)
	echo "::notice::[$label] FTP $path → ${built:-missing}${when:+ (modified $when)}"
done
live=$(curl -s --max-time 20 "https://visualstudiosplus.com/?inspect=${GITHUB_RUN_ID:-0}-$label" | bundle)
echo "::notice::[$label] live site → ${live:-nothing}"
