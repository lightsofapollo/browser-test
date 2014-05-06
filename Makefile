SRC := $(wildcard client/*.js)
BUILD_ARGS := -s browserTest -n browser_test

default: build/browser_test.js

build/browser_test.js: $(SRC) node_modules node_modules/socket.io-client/socket.io.js
	component build $(BUILD_ARGS)

node_modules: package.json
	npm install

.PHONY: watch
watch:
	component build --watch $(BUILD_ARGS)

.PHONY: test
test: build/browser_test.js
	./node_modules/.bin/mocha test/integration_test
