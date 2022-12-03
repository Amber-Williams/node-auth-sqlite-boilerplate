# Community board

## Running locally

1. To install dependencies run `yarn install`
2. Run `yarn develop` and leave the server running. The server will update on any local changes.

## Formatting & Linting

To test - `yarn test:lint && yarn test:format`
To fix errors - `yarn format:fix && yarn lint:fix`

## Running tests

`yarn test`

### Commit hooks

1. Requires `pre-commit` - `brew install pre-commit`
2. Set up hooks by running `pre-commit install`
