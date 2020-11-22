# cytube-fileserver

Nginx proxy with simple Node server to serve custom media manifests to Cytube channels

## Requirements

- Yarn
- Node
- Nginx

## Development

Use yarn instead of npm.

Running `yarn` in the project directory will install dependencies.

Use `yarn lint` to run ESLint. Use `yarn lint --fix` to repair auto-fixable problems.

`yarn format` will run Prettier.

`yarn start:nginx` will start the proxy, and `yarn start:node` will start the express server.

`yarn start` will start both simultaneously, which is almost always what you'd want.

`yarn watch:nginx`, `yarn watch:node`, and `yarn watch` will do the same as the above,
now including automatic reload.

Most of these scripts may not work on Windows.

## Configuration

// todo

## Deployment

// todo