babel := node_modules/.bin/babel

sourceFiles = $(shell find src -name '*.js')
distrubutionFiles = $(patsubst src/%,dist/%,$(sourceFiles))

all: $(distrubutionFiles)
.PHONY: all

dist/%: src/%
	mkdir -p $(dir $@)
	$(babel) $< --out-file $@ --source-maps
