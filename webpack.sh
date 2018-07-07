#!/usr/bin/env bash
#

export PATH="node_modules/.bin:$PATH"

# weird, the hot reload server fails if this hasn't been done
if [ ! -d "node_modules/webpack" ]; then
	npm link webpack
fi

webpack --watch