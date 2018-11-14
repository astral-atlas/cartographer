NODE_MODULES_BIN = node_modules/.bin

BABEL = $(NODE_MODULES_BIN)/babel
CONCURRENTLY = $(NODE_MODULES_BIN)/concurrently
NODEMON = $(NODE_MODULES_BIN)/nodemon
SERVE = $(NODE_MODULES_BIN)/serve

SOURCE = ./src
DISTRIBUTABLE = ./dist
DEMO = ./demo

.PHONY: all demo dev

all:
	$(BABEL) $(SOURCE) -d $(DISTRIBUTABLE)

dev:
	$(BABEL) $(SOURCE) -d $(DISTRIBUTABLE) -w & $(NODEMON) ./dist

demo:
	$(SERVE) $(DEMO)