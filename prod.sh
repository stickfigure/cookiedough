#!/usr/bin/env bash
#
# The directory isn't called 'dist' because we globally ignore that in InteilliJ
#

export PATH="node_modules/.bin:$PATH"

set -x

rm -f ../cookiedough.zip
rm -rf distro/js
NODE_ENV=production webpack
rm distro/js/*.map

cd distro
zip -r ../../cookiedough.zip *