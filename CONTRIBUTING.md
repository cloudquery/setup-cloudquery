
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
Once you submit a PR, a bunch of CI tests will run on it PR and ensure existing functionally works as expected.

>It's always recommended to [open an issue](https://github.com/cloudquery/setup-cloudquery/issues/new/choose) first to discuss changes. This ensures PRs are reviewed, merged and shipped as fast as possible.

## Releasing a new version

To release a new version simply merge the release PR (visit [this PR for an example](https://github.com/cloudquery/setup-cloudquery/pull/43)).
Once the release PR is merged a new tag and release will be created automatically.
Once the release is created you'll need to manually publish it to the GitHub Actions Marketplace by editing the release.
For example [follow this link to edit v1.0.4](https://github.com/cloudquery/setup-cloudquery/releases/edit/v1.0.4):
![image](https://user-images.githubusercontent.com/26760571/177048045-53f4191d-b5a8-4168-a8b0-cb7612abbcb4.png)

Ensure the `Publish this Action to the GitHub Marketplace` checkbox is checked, and click `Update release` at the bottom:

![image](https://user-images.githubusercontent.com/26760571/177048056-250c9412-11dd-44f7-a9ae-56191e7c50d0.png)
