# Cartographer
**Mapping your way through the _Astral Atlas_**

[![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/astralatlas/cartographer)](https://hub.docker.com/r/astralatlas/cartographer)
![GitHub package.json version](https://img.shields.io/github/package-json/v/astral-atlas/cartographer)

## Usage
Run through docker:
```bash
docker run \
  -v $(pwd):/opt/cartographer \
  astralatlas/cartographer \
    -c /opt/cartographer/local.config.json
```
You need to mount a volume to provide a configuration file,
and then pass the path of that configuration file to the
process via the argument `-c`.

Alternativley, run locally with `Node`, version 12.
```bash
node src -c local.config.json
```

## Contributing
Requires at least Node 12.

Run tests using `@lukekaalim/test`.
```bash
node test
```
