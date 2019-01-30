# Atlas-Scribe

## Contributing
Requires at least Node 10.

Build project from source via `make`.
```bash
make
# Or build it continuously in a dev environment using watch
watch make
```
Run tests using `jest`.
```bash
npx jest
# Or just run a subset of tests
npx jest unit # Unit tests
npx jest int # Integration tests
npx jest acc # Acceptance tests
```
Run application using `node`.
```bash
node dist
# Or inspect it for debugging
node inspect dist
# Or run it continuously in a dev environment using nodemon
nodemon dist
```
Check your code using `eslint`
```bash
npx eslint src
```

