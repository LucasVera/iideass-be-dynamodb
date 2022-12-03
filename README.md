# Iideas BE
A place to share your ideas with the world!

This is the backend API meant to be used by a frontend to create, list, update and delete ideas of a user

## What is an Idea?
An Idea has the following main properties:
- __email__: email of the user that this idea belongs to
- __subject__: Subject or title of the idea
- __description__: Description of the idea
- __ideaType__: Type of the idea (Story, App, Dish, Non tech project, Vacation trip, Other idea)

An idea represents something that a user wants to store and potentially share with others. It can be a vacation trip planning, a new cooking dish recipe that wants to try and tweak, among others.

## Features

Current features are:
- User is able to create a new idea
- User is able to update an idea
- User is able to list its ideas
- User is able to get one of its ideas
- User is able to delete an idea

## Tech
This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

Main tech used to build the project are
- Node.js
- Typescript
- Serverless framework
- AWS
- Jest
- Cypress

## Deployments
This api is deployed in AWS as a serverless app. The following diagram shows the high-level overview of the cloud resources and general flow of the serverless app

## CI/CD
This api is connected to a CI/CD pipeline for easier deployments. The following diagram shows a good approach to handle CI/CD in a larger team

## How to test
This api ships with a postman collection that's ready to use to test the api. In order to use it, simply clone the project, open postman and import the collection from `docs/Iideas-dynamodb.postman_collection.json`. It uses collection variables to handle the url. If you wish to switch between environments, it's enough to swap the `url` parameter with the appropriate `dev-url` or `prd-url`. The following image may help

### How to run
Follow the steps below to install and run in your local machine
- Clone the project
- At the root of the project, run `npm install`
- At the root of the project, run `npm start`
- You should see a list of available endpoints in the console
- (optional) run unit tests `npm test`
- (optional) run the project, then open another tab and run integration tests `npm run test:integration`

## Roadmap
This project is a POC and still has a lot of work pending. In the future, some _ideas_ to improve the project could be:
- Add linter (eslint) with recommended rules
- Use Git hooks (pre-commit, pre-push) to maintain code quality (lint pre-commit, unit tests pre-push)
- Protect main branches (`main`, `develop`) to avoid commits directly
- Improve deployments (artifact repo, process for standard rollbacks, automatic pipeline)
- Add another environment `stg` for testing team
- Add static code analysis (sonarqube, codacy, etc)
- Add dynamic tests (security, load, smoke)
- Improve code coverage, add reporters
- Add OpenAPI specs, automate schema validation, improve documentation
