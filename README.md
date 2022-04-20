<p align="center">
  <img width="150" src="https://raw.githubusercontent.com/conceptadev/rockets/main/assets/rockets-icon.svg">
</p>

# Rockets Starter

A mono-repo composed of an example Rockets API implementation with a compilimentary
Rockets React web front end.

A Docker container for api, web, database is provided, as well as support for the VSCode Remote Containers extension (dev container).

## Project

[![GH Last Commit](https://img.shields.io/github/last-commit/conceptadev/rockets-starter?logo=github)](https://github.com/conceptadev/rockets-starter)
[![GH Contrib](https://img.shields.io/github/contributors/conceptadev/rockets-starter?logo=github)](https://github.com/conceptadev/rockets-starter/graphs/contributors)
[![NestJS Dep](https://img.shields.io/github/package-json/dependency-version/conceptadev/rockets-starter/@nestjs/core?label=NestJS&logo=nestjs&filename=packages%2Frockets-api%2Fpackage.json)](https://www.npmjs.com/package/@react)
[![React Dep](https://img.shields.io/github/package-json/dependency-version/conceptadev/rockets-starter/react?label=React&logo=react&filename=packages%2Frockets-web%2Fpackage.json)](https://www.npmjs.com/package/react)

## Environment

Choose your preferred development environment from one of the three options below.

- [VSCode Dev Container](#vscode-dev-container)
- [Docker Compose](#docker-compose)
- [Local Machine](#local-machine)

### VSCode Dev Container

If you are familiar with VSCode, running the project in a dev container is highly recommended.
It is an additional layer on top of Docker which enables you to edit the files on the container app
directly from VSCode.

#### Prerequisites

- [Visual Studio Code](https://code.visualstudio.com)
- [Remote Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- [Docker Desktop](https://www.docker.com/get-started)

#### Launch Container

1. From a new VSCode window, open the _Source Control_ panel.
1. Click the _Clone From Repository_ button.
1. Enter the project's git url: **https://github.com/conceptadev/rockets-starter.git**
1. Choose a local folder where the project will be cloned.
1. Once the project has loaded, you should see a notification in the lower right corner that a Dev Container configuration file has been detected.
1. Click the _Re-open In Container_ button.

VSCode will automatically invoke Docker to download, compose and connect to the container, and install all dependencies.
Depending on your machine, this could take a while.
Don't worry, it only needs to build the container the first time!

> By default, and for performance reasons, the `docker-compose.yml` is
> configured to create a new Docker volume and check out a fresh copy of the repo there.
> These are _NOT_ your local files, if you manually delete the volume, any modifications will be lost.

You are now connected to the container and ready to initialize and run [the sandbox](#the-sandbox) in the remote container!

### Docker Compose

Running the project on Docker is a quick way to get the ideal environment created and configured.
See also [VSCode Dev Container](#vscode-dev-container) which is an additional layer on top of Docker.

#### Prerequisites

- [Docker Desktop](https://www.docker.com/get-started)

#### Installation

Clone the source code into your local directory of choice, and run `docker compose up`.

```bash
git clone https://github.com/conceptadev/rockets-starter.git
cd rockets-starter
docker compose up
```

This will build the container, and install all dependencies.
Depending on your machine, this could take a while.
Don't worry, it only needs to build the container the first time!

> By default, and for performance reasons, the `docker-compose.yml` is
> configured to create a new Docker volume and check out a fresh copy of the repo there.
> These are _NOT_ your local files, if you manually delete the volume, any modifications will be lost.

#### Connect to Container

1. Open Docker Desktop
1. Open the _Containers / Apps_ menu.
1. Select the container app containing `rockets-starter`. (It will be using the `maz37/rockets-node` image.)
1. Click the _CLI_ button to connect to the running docker app's terminal.

You are now ready to initialize and run [the sandbox](#the-sandbox) in your docker container!.

### Local Machine

Follow the steps below to set up the environment on your local machine.

#### Prerequisites

Your local environment must have the following prerequistes installed:

- [Node v16+](https://nodejs.org/)
- [PostgreSQL v11+](https://www.postgresql.org/download/) (v12+ recommended)
- [Yarn](https://classic.yarnpkg.com/) (latest v1.X recommended)

You can verify that you have these installed by running the following shell commands.

```bash
node --version
postgres --version
yarn --version
```

#### Installation

Clone the source code into your local directory of choice, and run `yarn install`.

```bash
git clone https://github.com/conceptadev/rockets-starter.git
cd rockets-starter
yarn install
```

> Since we are working in a monorepo, you only need to run install from the root of the project.

#### Configuration

You may need to modify the database configuration depending on how your local PostgreSQL instance is set up.

The simplest way to change the connection settings is by exporting the `DATABASE_URL` env variable like the following example.

```bash
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rockets-starter
```

Or, you can create the `packages/rockets-api/.env` file containing a line like the following example.

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rockets-starter
```

For more advanced configuration, you can edit the `packages/rockets-api/ormconfig.js` file directly.

You are now ready to initialize and run [the sandbox](#the-sandbox) on your local machine!.

## The Sandbox

Congratulations! You have your environment set up, and you are ready to start playing.

### Initializing

Starting again from the root of the project, run this command to initialize the sandbox.

```bash
yarn sandbox:init
```

This will create the database if it does not exist, run database migrations to create the schema, and run the database seeder to populate some data.

A Super Admin account has been created as follows:

|          |            |
| -------- | ---------- |
| Username | superadmin |
| Password | Test1234   |

### Start the API

To start the API, run this command:

```bash
yarn start:api
```

The api should now be running at http://localhost:3001

You can view the endpoint documentation and interact with the API in realtime at http://localhost:3001/api

### Start the Web Server

To start the web server, run this command:

```bash
yarn start:web
```

The web should now be running at http://localhost:3000/login

### Rebuilding the Sandbox

If you ever want to start over with a fresh database, run this command to rebuild the sandbox.

> IMPORTANT this is a destructive operation.

```bash
yarn sandbox:rebuild
```

## Contributing

This project is currently in alpha testing, however, feedback is highly
appreciated and encouraged!

Pull requests will be gratefully accepted in the very near future,
once we have finalized our Contributor License Agreement.
