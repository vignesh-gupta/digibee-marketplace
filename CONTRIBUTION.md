# CONTRIBUTING

When contributing to this repository, please first discuss the change you wish to make via [issues](https://github.com/vignesh-gupta/digibee-marketplace/issues).

Please note if you are working on a certain issue then make sure to stay active with development.

## Git Commit, Branch, and PR Naming Conventions

When you are working with git, please be sure to follow the conventions below on your pull requests, branches, and commits:

```text
PR: #[ISSUE ID] Title of the PR
Branch: [ISSUE ID]-title-of-the-pr (shorter)
Commit: [[ISSUE ID]] [ACTION]: what was done
```

Examples:

```text
PR: #2 Add Docker container for Postgres
Branch: 2-add-container-postgres
Commit: [2] feat: add docker container for postgres
```

## Prerequisites

### Install Docker

You will need to [install docker](https://www.docker.com/get-started/) on your local machine.

If you do not have docker, go here to download and install: <https://www.docker.com/get-started/>

If you see error starting db on M1 mac, you may need to update your docker config file at `~/.docker/config.json`
Your file should look like something like this:

```
{
        "auths": {},
        "currentContext": "desktop-linux"
}
```

If you are getting WSL error when you launch your desktop docker application, go here and follow these steps for windows: <https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package>.


### Own s3 bucket

You will need to create your own s3 bucket to store the images. You can create a free account on [AWS](https://aws.amazon.com/) and create a bucket there.

## Installation

To get started with Digibee locally, follow these steps

1. Make sure you have installed Docker locally (See above Prerequisites)

2. Fork the repo

3. Clone your fork

   ```sh
    git clone https://github.com/<YOUR_GITHUB_ACCOUNT_NAME>/digibee-marketplace.git
   ```

4. Navigate to the project directory

   ```sh
   cd digibee-marketplace
   ```

5. Create a .env file inside the project's packages/app directory.

6. Copy and paste variables from `.env.example` into `.env`

7. Install NPM packages (you might need to run with --force as we have some packages that are not compatible with each other or use yarn instead)

   ```sh
   npm i
   ```

8. Start the Database & Dev Server

   ```sh
   npm run dev
   ```

9. Open your browser and visit <http://localhost:3000> to see the application running.

## Working on New Features

If you're new to Github and working with open source repositories, [@webdevcody](https://github.com/webdevcody/) made a video a while back which walks you through the process:
[![How to make a pull request on an open source project](https://img.youtube.com/vi/8A4TsoXJOs8/0.jpg)](https://youtu.be/8A4TsoXJOs8)

If you want to work on a new feature, follow these steps.

1. Fork the repo
2. Clone your fork
3. Checkout a new branch
4. Do your work
5. Commit
6. Push your branch to your fork
7. Go into github UI and create a PR from your fork & branch, and merge it into upstream MAIN

## Pulling in changes from upstream

You should pull in the changes that we add in daily, preferably before you checkout a new branch to do new work.

```sh
git checkout main
```

```sh
git pull upstream main
```

## Before Submitting a Pull Request

Before submitting a **Pull Request**, you should

1. Check your code safety with Linter and TypeScript, and make sure your code can build successfully.

```sh
npm run pr:precheck
```