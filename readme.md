# Cartographer
**Mapping your way through the _Astral Atlas_**

![alt text](https://codebuild.ap-southeast-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoicEE3dVBQS1pJT2VTaVNka0VFNWhlbi9HL283TVdxT08zVU5QWFBpWnZ0QlZyWkJRelNmNWZSSVhZemlVVnBRZFJ4aUM4cHI2NFdhQWN2Q2xERUVsVFdzPSIsIml2UGFyYW1ldGVyU3BlYyI6IlYvTWNnU1Nzb0xnN1hYWVoiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master "Master Build State")


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
# Or test it continuously in a dev environment using watch
npx jest --watch
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
Run the demo using `serve`
```bash
npx serve atlas-quill
```
