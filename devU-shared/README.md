# DevU Shared Modules

This project exists as a shared resource between the DevU api and client projects

For usage [see](/devU-shared/README.md#devu-shared-modules)

## Project Dependencies (install these)

- [Node](https://nodejs.org/en/) - A javascript interpreter to run JS outside of the browser

## Related Projects

- [Dev U Client](https://github.com/UBAutograding/devU-client) - React
- [Dev U API](https://github.com/UBAutograding/devU-api) - Node/ Express

## Running the project locally

This project doesn't run locally outside of tests, as it's primary use is typescript types, and general purpose utility functions.

### Testing

We're using [jest](https://jestjs.io/docs/getting-started) as our testing framework of choice. To run the entire test suite, use:

```
npm test
```

Keep in mind that when testing, jest is looking for `*.test.ts` files, so be sure to include the `.test` portion in those filenames.

## Building the project

You can build the project as a production build

```
npm run build
```

This throws the production build into `./build` and can be run with

```
node index.js
```
