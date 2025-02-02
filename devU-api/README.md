# devU API

This is an API for the v4 autograder. The main purpose of this project is to act as an in-between for the containers doing the autograding, and the users submitting assignments.

## Project Dependencies (install these)

- [Node](https://nodejs.org/en/) - A javascript interpreter to run JS outside of the browser
- [Docker](https://www.docker.com/get-started) (this is for the DB) - Containerization

For now the only reason we're including docker is to more easily control the development database. In the future we may very well dockerize the api itself for ease of development and deployment, but for now this writeup is expecting it to be running directly on your machine via node.

## Running the Project Locally

### Getting Everything Started

Once you've got these installed, we can build our container and run it

#### Note to run the postgres container locally using the command below

You have to modify `devU-api/src/environment.ts`

change

`dbHost: (load('database.host') || 'localhost') as string`

to

`dbHost: 'localhost'`

This will probably be fixed in the future but for now the above steps are necessary

#### Using docker compose

We use [docker compose profiles](https://docs.docker.com/compose/profiles/) to selectively start services in the main docker-compose when developing.

Assuming you are in api dir `devU-api`, To start all api services except the api run

```
npm run api-services
```

To stop the services

```
npm run api-services-stop
```

Then install dependencies using

```
npm install
```

Once you've got all the dependencies installed you can run the project via

```
npm start
```

#### Manually:

```
docker run \
  --name typeorm-postgres \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=typescript_api \
  -e POSTGRES_USER=typescript_user \
  -d postgres
```

Install all node dependencies. All of the database environment variables can change, and can be set as environment variables on your machine if you want to overwrite the defaults

```
docker run \
  --name minio \
  -p 9002:9000 \
  -p 9001:9001 \
  -v /tmp/data:/data \
  -e "MINIO_ROOT_USER=typescript_user" \
  -e "MINIO_ROOT_PASSWORD=changeMe" \
  -d minio/minio server /data --console-address ":9001"
```

Install all node dependencies. All of the database environment variables can change, and can be set as environment variables on your machine if you want to overwrite the defaults

```
npm install
```

Run the setup script to create local development auth keys. These are used in local development for signing and authenticating JWTs.

```
npm run generate-config
```

Run the initial migrations to setup our DB schema

```
npm run typeorm -- migration:run -d src/database.ts
```

Once you've got all the dependencies installed you can run the project via

```
npm start
```

By default the project runs at `localhost:3001`, but you can change the port by setting an alternate port by setting the `PORT` environment variable.

If you're working in vscode, a configuration has been included to allow for debugging. Open up the VS Code Run and Debug section and click `Debug API`.

### Convenient Devtools

The project has some nice devtools built into it that will make your life easier. Leaving these here to hopefully help make the engineering process a bit smoother as well as keep someone a bit more sane.

`environment.ts`: This is a rollup file for all the environment variables that the project uses as well as their fallbacks if none are provided. What this means is you can overwrite any of there easily **without having to change code** if you ever have a need to do so. Here's a command-line tip: you can set temporary environment variables on a per process basis by adding them before the command you want to run. Example: If we wish to set some value for `LOG_DB` temporarily, we can run the api like:

```
LOG_DB=1 npm start # this is a helpful command if you wish to log all sql commands to the DB when developing
```

Use [VSCode](https://code.visualstudio.com/) as your text editor/ IDE. There's already a debugging script setup in the repository that allows you to run this project through VSCode (the vscode script is called `Debug API`). Once running through VSCode you can set debug to your hearts content (**SERIOUSLY IF YOU'RE CODING WITH** `console.log` **STOP THAT**).

[Prettier](https://prettier.io/) is a library that's already installed and deals with code formatting. It will format all of your code on commit so that you never have to worry about style matching to the project. If you wish to see your code styled in real time, VSCode has a prettier plugin that will format on save for you (you don't _have_ to do this, it'll still format on commit). Alternatively, you can manually format all of the code in the project with:

```
npm run format
```

Use [Azure Data Studio](https://docs.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio?view=sql-server-ver15) (or some other sql client) for easier sql queries/ testing while developing. We're using [PostgresSQL](https://www.postgresql.org/) so keep that in mind while googling how to query things as the syntax and features can be slightly different across sql flavors. **[AZURE DATA STUDIO REQUIRES A POSTGRES PLUGIN TO WORK WITH POSTGRESQL](https://docs.microsoft.com/en-us/sql/azure-data-studio/extensions/postgres-extension?view=sql-server-ver15)**. So if you want to use Azure Data Studio, you'll have to install that extension.

### Local Auth Providers

If you're looking for more information on how to setup auth for your development environment, check out more info [here](./docs/localAuth.md)

## Working in the Project

This project is built using

- [Typescript](https://www.typescriptlang.org/) - A superset of JavaScript. The language of the application
- [Express](https://expressjs.com/) - A Node REST framework.
- [TypeORM](https://typeorm.io/#/) - A Typescript ORM (manages the DB and all DB calls)

For those unfamiliar with Express, I'll attempt to give a brief rundown before talking about the project structure as a whole.

### Middleware

Express is a REST framework for node. Devs new to express will likely find one of the most perplexing parts of Express to be how it handles middleware. For those unfamiliar with what middleware is, it's largely a catch all term for code that connects together pieces of code in the api. In Express's context, middleware is basically everything that runs within each router; here's an example:

```typescript
Router.get('/:id', asInt(), UserController.detail)
```

In express, all of the functions added after the route's path are considered middleware and each route can have as many middleware as is needed. In this project we separate out `controllers` into their own directory though they are still considered middleware.

Express's middleware is always a function with three arguments

```typescript
function middlewareName(req: Request, res: Response, next: NextFunction)
```

Here's what you need to know:

- Middlewares are called sequentially in the order of the arguments list
- You pass data between middlewares by adding whatever you want to pass to the `req` object.
  - es `req.users = userResponse`
  - Because we're in typescript you'll have to add whatever parameter you're passing to `@types/express/index.d.s`
- Calling `next()` moves you to the next piece of middleware in the chain
  - Calling `next` with _any_ arguments is considered throwing an error and will stop you from going to the next middleware, and it will bubble back the chain to the `globalErrorHandler`.

### Control Flow

Here's the basic layout of the application

![control flow of the api](/docs/controlFlow.png 'Control Flow')

Let's take this from the top

- `index.ts`: where the application is bootstrapped from, controls all global server controls and middlewares
- `routers/index.ts`: largely a rollup for all the other routers. Can be used to add router specific middleware to routes/ subroutes
- `routers/route.ts`: Individual routes for each resource, where the list of middleware can be found. _All routers call unique middleware_
- Middleware: The above diagram is a bit of a misnomer. Not every endpoint will have auth, validators, and controllers. Some will have all of those, some may have none. Each route will have at least one middleware, and the last middleware will deal with returning the requested data
- Auth: checks the access/ refresh tokens
- Validators: validates the bodies of requests
- Controllers: deals with setting status codes, and directing to services. For the most part, controllers should be the last piece of middleware in the chain.
- Services: Workhorse of the application. Deals with all major application logic and database calls

The database models live outside of this control flow as they don't deal with any business logic. However services will use them to access the database. You can largely think of the models as a 1:1 map to database tables.

### Shared Modules

This project uses shared modules to share types between the api and the client. What this means is that there exists
code that operates in both this project and it's client. That project is being imported here as `devu-shared-modules`.

To generate types for local development run the following commands (all commands assume you are in project root)

1. ```bash
   cd ./devu-shared
   ```
2. ```bash
   npm install
   ```
3. ```bash
   npm run build-local
   ```

This will create a `devu-shared-modules` folder in `devU-api` and `devU-client` dir

When developing if you need to create a new type,

1. create the type file in `devu-shared/src/types/example.type.ts`
2. export the new type in `devu-shared/src/index.ts`
3. rerun
   ```bash
   npm run build-local
   ```

This will update the types in `devU-api` and `devU-client` folders.

**Note if the types are not being detected by your IDE**

**Go to the `devU-api/` and `devU-client/` and run `npm install` in each folder to update the shared modules.**

### Testing

We're using [jest](https://jestjs.io/docs/getting-started) as our testing framework of choice. To run the entire test suite, use:

```
npm test
```

Keep in mind that when testing, jest is looking for `*.test.ts` files, so be sure to include the `.test` portion in those filenames.

If during development, you want to only run a single test file (via command line), you can do so by adding a string to the end of the test command. That string will be used as a regex against the filename(s). So as an example, if we wanted to run all of the controller tests, you could do so by:

```
npm test "controller"
```

Alternatively, if you're wanting to _just_ run the user.controller tests, you can do so via

```
npm test "users.controller"
```

And lastly, if you want to narrow it down to running less than a single test file (even down to a single test), you can do so via the `-t` argument. (Small pro tip, when running an `npm script` you can pass it extra command line arguments by passing a `--` first, that's what's happening here)

```
npm test -- -t "some test description or name"
```

I wouldn't recommend digging that far down as the of tests should be more human-readable, and therefore not super great to grab via a regex; but if you really wish to do so, you can.

### Common TypeORM Commands (Database/ Schema Stuff)

If the schema needs to be updated, you can do so by updating the models and running

```
npm run typeorm migration:generate -- -d src/database src/migration/<generatedMigrationName>
```

Doing so will attempt to create an auto migration from any changes within the `src/models` directory and add it to `src/migrations`. If an auto migration is generated for you (always check your auto migrations), you can run it with the above migration command

```
npm run typeorm -- migration:run -d src/database.ts
```

And revert the latest migration with

```
npm run typeorm -- migration:revert -d src/database.ts
```

### Configuration Options

Most of the API's configuration options live in a file called `environment.ts`. That file is bootstrapped at startup using the [config library](https://www.npmjs.com/package/config), as well as some environment variables.

What this means for you (the developer) is that you can control certain api options via environment variables at runtime, or by using your `config/default.yml`. To see which `environment.ts` options support using environment variables directly, open that file and see which are using `process.env.*`; everything else should be configurable via your `default.yml`

If you update your `default.yml` be sure to hard restart your API, as changing the config options does not update until you rebootstrap the API.

### Style Guide

While we use prettier to control most of the style choices for the application, it is not a silver bullet. Here we'll list a few conventions that will (hopefully) make working in the API a little bit more sane.

When importing stuff we try to keep things in a certain order. Example

```
import Libraries

import RootLevelStuff

import Controllers

import Middleware

import Routers

import Utils
```

The important thing here is once you get into the modules (models/ controllers/ routers/ etc), import them alphabetically with a single empty line in between them.

## Production Builds

You can build the project as a production build

```
npm run build
```

This throws the production build into `./build` and can be run with

```
node index.js
```
