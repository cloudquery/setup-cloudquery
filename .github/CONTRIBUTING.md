
# Contributions

🎉 First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to this repository.

## Prerequisites

- Fork and clone this repository. If you're not sure how to do it follow [this getting started guide](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github).
- [Node.js](https://nodejs.org/en/) installed with a version greater or equal to 16.

## Setup

Run `npm ci` to install dependencies

## Running locally

You can either use `npm run start` to start the `main.ts` file, or use the [act](https://github.com/nektos/act) tool to run the GitHub action locally.

## Submitting a PR

We use [prettier](https://prettier.io/) and [eslint](https://eslint.org/) to format and lint our code.
Before submitting a PR please run `npm run format` and `npm run lint` to ensure your code matches our style.
Once you submit a PR, a bunch of CI tests will run on your PR and ensure existing functionally works as expected.

>It's always recommended to [open an issue](https://github.com/cloudquery/setup-cloudquery/issues/new/choose) first to discuss changes, to ensure PRs are reviewed, merged and shipped as fast as possible.
