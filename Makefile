SRC := $(wildcard client/*.js)
BUILD_ARGS := -s browserTest -n browser_test

default: build/browser_test.js

node_modules: package.json
	npm install

components: node_modules
	./node_modules/.bin/component install

build/browser_test.js: components $(SRC)
	./node_modules/.bin/component build $(BUILD_ARGS)

.PHONY: watch
watch:
	./node_modules/.bin/component build --watch $(BUILD_ARGS)

.PHONY: test
test: build/browser_test.js
	./node_modules/.bin/mocha test/integration_test

doc:
	./node_modules/.bin/jsdoc -c jsdoc.json -d doc README.md
