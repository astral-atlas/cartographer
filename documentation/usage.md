# Usage

## Config Loading

Astral Atlas - Cartographer needs an input configuration file to get started. It accepts a path at runtime, where it
will attempt to locate and read. That path can be provided a number of ways:

 - Application arguments `-c` or `-config`
 - Environment Variable `CARTOGRAPHER_CONFIG_PATH`
 - Defaults to `local.cartographer.json` inside the working directory

The prority of the sources is listed below:
1. `-c`
2. `-config`
3. `CARTOGRAPHER_CONFIG_PATH`
4. `local.cartographer.json`

If a config cannot be loaded for whatever reason, the application will terminate with an error code of `1`, and log the resulting error to `STDOUT`.

### Example 1
```bash
docker run -v $(pwd):./opt/cartographer astralatlas/cartographer -c ./opt/cartographer/config.json
```
This example runs the application as a docker container, mounting the current working directory to the container
at the location `./opt/cartographer`, which we then pass to the program itself via the `-c` argument, with the
absolute path of mounted config (assuming we have a `config.json` file in our current working directory)

### Example 2
```yaml
version: '3'
services:
  web:
    command: ["node", "src"]
    build: .
    environment:
      CONFIG_PATH: /opts/cartographer/local.config.json
    ports:
    - "8080:80"
    volumes:
    - .:/opts/cartographer
```

This example is the default **docker-compose** file included with the repository, and much like the other example, mounts the local directroy to `/opts/cartographer` in the container. However, we define an environment variable to pass the location of our config file to the application called `CONFIG_PATH`.

### Example 3
```bash
node src -c local.config.json
```
Here, we run the application's source code from our local node instance, passing in the local config directly.

### Example 4
```bash
node src
```
And in this example we rely on an implicit `local.cartographer.json` to be present.