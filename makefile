babel := node_modules/.bin/babel

sourceFiles = $(shell find src -name '*.js' -not -name '*.test.js')
distrubutionFiles = $(patsubst src/%,dist/%,$(sourceFiles))

all: $(distrubutionFiles)
.PHONY: all fast

fast:
	$(babel) src --out-dir dist --source-maps --ignore "src/**/*.test.js"

dist/%: src/%
	mkdir -p $(dir $@)
	$(babel) $< --out-file $@ --source-maps
