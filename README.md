# Project Description

This is a node application that utilizes Google sheets, Puppeteer and Clearbit in order to fully automate applying and tracking
jobs applied through AngelList. . This application will customize your cover letter, apply to your job application link, and
update your spreadsheet to keep track of which jobs you applied for. Should you want to follow-up with the recruiter to check on status, you can do that as well.

## Motivation

This application was born from the issue that I (and others) were facing, in that applying to jobs for a
certain website was too time consuming. This is my answer to save time.

Demo can be found here: https://www.youtube.com/watch?v=Emb9WG2ijDE&feature=youtu.be

## Built with

- Puppeteer
- Clearbit Prospector API
- Google sheets API

## Installing

- Clone/fork this repo to your local repository.
- Run npm install from the root of this project

## Dependencies/Requirements

- Google API key (Twilio link below has great instructions on how to retrieve your API key)

  - link here: https://www.twilio.com/blog/2017/03/google-spreadsheets-and-javascriptnode-js.html

- Google sheet ID

  - Google sheet ID is parsed from the URL after the '/d/' and before the '/edit' in the URL.

- Node Google Spreadsheet

  - NPM package / documentation: https://www.npmjs.com/package/google-spreadsheet

- Clearbit API key

  - Sign up here: https://dashboard.clearbit.com/signup
  - API docs here: https://github.com/clearbit/clearbit-node
  - Get your API key here: https://dashboard.clearbit.com/api

- AngelList account
- Node

## Instructions on running AutomationApplier

1.) Once you've signed up and retrieved your keys/IDs, you will need to create a config folder, `cd` into config and edit
the parameters as described within the `config_test_file_example.js` file.

2.) Enter in your desired cover letter in the coverLetter.js file and edit custom variables to how you desire.
3.) Within the terminal at the root of the project, type `npm run apply`.
