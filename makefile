NODE_MODULES_BIN = node_modules/.bin

BABEL = $(NODE_MODULES_BIN)/babel
CONCURRENTLY = $(NODE_MODULES_BIN)/concurrently
NODEMON = $(NODE_MODULES_BIN)/nodemon

SOURCE = ./src
DISTRIBUTABLE = ./dist

.PHONY: all

all:
	$(BABEL) $(SOURCE) -d $(DISTRIBUTABLE)

dev:
	$(BABEL) $(SOURCE) -d $(DISTRIBUTABLE) -w & $(NODEMON) ./dist