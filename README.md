# Express Backend Server

> ## Important: Read the configuration instructions before continuing.

## Environment Variables

> #### This project uses environment variables to handle configuration. These can be set from the command-line or in a `.env`
>
> file at the root of this project.

The following environment variables are available to configure this application:

### `PORT`

> Default: `3001`

Determines the port that the server runs on.

### `ORIGIN`

> Default: `http://localhost:3000`

Sets an allowed origin for the server's [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) policy.

### `MONGO_URI`

> Default: `mongodb://localhost:27017/st-marks-graveyard`

Specifies the database to be used by the server.

## Database

This Backend requires a MongoDB connection to start. For local development, you should
install [MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/). For deployment,
a MongoDB URI can be provided through the `MONGO_URI` environment variable.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.

The server will reload if you make edits.\

### `npm run build`

Builds the backend for production to the `build` folder.

### `npm test`

Launches the test runner.

### `npm run format`

Formats all files using Prettier

### `npm run lint`

Lints all files using ESLint. Use `npm run lint:fix` to automatically apply available fixes.
