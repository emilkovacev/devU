# DevU Client

This project is the client for the DevU autograder. It's intent is to act as a way to manage courses, assignments, and students, for professors/ tas; and submit, edit, and run assignments for students.

## Application Technologies

- [React](https://reactjs.org/docs/getting-started.html) - Javascript frontent framework
- [Typescript](https://www.typescriptlang.org/docs/handbook/react.html) -
- [Webpack](https://webpack.js.org/) - Bundles all assets/js/css/etc into status html/css/js
  - [Babel](https://webpack.js.org/loaders/babel-loader/) - JS bundler. Converts React js to browser js
  - [Sass](https://github.com/webpack-contrib/sass-loader) - Fancy css. Supports more features. Bundles down to css
- [Node](https://nodejs.org/en/) - Used to run webpack.

## Running the Application
All commands below assume you are in client directory: ```devU-client```

We are using an older version of node, 
so you might need to use a node version manager to switch to an older version.

Below are instructions for [NVM](https://github.com/nvm-sh/nvm), but you are free to use whatever version manager you prefer.

Install [NVM](https://github.com/nvm-sh/nvm).
For Windows users use [NVM-windows](https://github.com/coreybutler/nvm-windows) 

As of writing, we are using node version 16, so run

**Warning this will change the node version globally
so for other projects you need to change node version again.**

```
nvm use 16
```

To switch back to latest version run 

```
nvm install latest # if latest version is not installed
nvm use latest
```

To verify node version

```
node -v # make sure it ouputs v16.X.X
```

Next install the project dependencies

```
npm install
```

Because this project lives almost entirely behind auth, this project requires [its API](../devU-api/README.md) to be running in order to operate correctly. 
Under normal circumstances you'd be able to hit the development or production APIs without having to run your own local API. 
But because those don't yet exist for now if you want to run this project you'll have to run a local version of the api to use this client.

You can start a local api in docker using 

```
npm run dev-backend
```

This will start all backend services required for the app.

To stop the api use

```
npm run dev-backend-stop
```

Once there project dependencies are installed and an api is running, we can run the project with a few different commands

```
npm run local # points to local api
npm start # points to development api (not yet availible)
npm run prod # points to production api (not yet availible)
```

## Convienent Devtools

If you're not familar with [chrome's devtools](https://developer.chrome.com/docs/devtools/), you should familiarize yourself with them as they are going to be your best friend when developing for this project.

Those tools can be used to debug your code, check network requests, edit css/html, checking local storage and cookies, and much more.

Beyond the base chrome devtools, as a react developer you should probably also install the [react devtools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) which can be used to check component state, as well as update component state, amongst other things.

Since we're also using [redux](https://react-redux.js.org/) in this project, I'd also reccomend installing the [redux devtools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) as well. This tool is great for updating state, as well as checking state for redux.

## Working in the project

This project is primarilly built using

- [React](https://reactjs.org/docs/getting-started.html)
- [Sass](https://github.com/webpack-contrib/sass-loader)

But also uses libraries fairly heavilly. Some of those libraries include

- [React redux](https://react-redux.js.org/api/hooks) - global state management tool
- [React router](https://reactrouter.com/web/guides/quick-start) - virtual router

There are many others that are used but those are the major players in making the app run the way that it does.

### The Application

When starting up the server, the `index.tsx` is the first component initialized. All other components in the chain stem from that component, so I'd reccomend checking it out to see what's going on in there.

### Some notes on some services

For ease and consistency of development a few services have been added that can be included and used as needed. Some of these are

- `request.service.ts` - Used for all network requests to the api. This service handles all of the auth required when communicating to the api so that as a developer you largely don't have to consider how to be sure a user is authenticated. This service supports all basic REST request types right now, but can be extended as needed.

- `history.service.ts` - Used for the routing of the application. This can be used to change pages, update url parameters, etc.

- `htmlHead.service.ts` - Code that gets built into the html `<head>` tag on build. Not likely used super often.

- `localStorage.service.ts` - Local storage access and write wrapper. A developer could hit local storage without this wrapper, but doing so in one spot allows the codebase to be kept a bit cleaner.

### Css and Themes

This application uses scss for all of it's styles. The scss is largely only used as it's called as we avoid the cascading parts of css at all costs. The only exception to this is the css that's been declared in `global.scss` that's imported and run from `index.tsx`.

`global.scss` is special because that should be the only place in the application that has cascading css. It is used to setup the theme color variables as well, though notably not _all_ of the variables, not even most really.

`variables.scss` is where the majority of the css variables are declared. We couldn't declare them all here because we need dynamic variables for themes to work as expected. Scss is by it's nature unable to be dynamic, so any theme based variables must be controller by vanilla css variables. Because we're using vanilla css variables for theme variables, those need to be set globally. Therefor that's why theme variables are set and them brought into `variables.scss`. Beyond that, variables is a bit special because it's the only scss file in the project that can be imported without any kind of pathing. This is because it's built into the build to be allowed to included without a path. It's a piece of syntactic sugar that the developer will need to be aware of when importing variables and other scss variables.

The theme of the application is bootstrapped by the `darkModeToggle` component. The catch of this is that unless that component is being renender, because this component exists on the globaltoolbar it shouldn't cause issues, but it is something to keep in mind.

The theme's state is stored in the browsers local storage so that the chosen theme will persist across users sessions.

### Environement Stuff

The environment of the application is controlled entirely (mostly) by it's `.env.*` files. These files live within the repository as public environment strings that are needed for production and development builds. All of their configuation options **should be public** as they're going into the build that will be pulled into the browser when a user loads the site. The reason we keep these options in the repository is so it's easy to connect to the development and production apis locally when developing (not availible yet).

These env files just offer a way to provide env vars without having to set them yourself, but they're not actually pulled into the application unless they're added to `config.ts`. There you can see how some env vars have been added, and subsequently then can be imported into the rest of the application for use.

All env variables can be overwritten by actually setting the matching variable on your local system.

## Building the Application

The application can be built in multiple different ways for multilpe different environments, here are the commands

```
npm run build # builds with .env.production
npm run build-local # builds with .env.local
npm run build-development # builds with .env.development
npm run build-all # builds all
```

All of these build to `./dist` then their environemnt as a sub directory (ex `./dist/local`). From there the bundled html, css, and js can be hosted by any normal webserver.
