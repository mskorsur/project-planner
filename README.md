# Project Planner application
The main function of the application is to enable easy and clear planning and managing of different projects in their lifecycles. Each lifecycle consists of an arbitrary number of phases in which it's necessary to complete certain tasks. How different phases and tasks are defined, organized and distributed is completely up to you and your project needs.

The front end part was made using React, Redux and Bootstrap libraries.
The back end part was done in Node and Express with MongoDB and mongoose.

### Requirements
When installing the app on your local machine make sure that you have a newer [node](https://nodejs.org/en/download/, "nodeJS download") version, at least 7.X or above and associated [npm](https://www.npmjs.com/, "npm homepage") package manager. MongoDB database is not required, as the application uses a cloud configuration for data storage.

### Installation and usage
1. Clone this repo on your machine using `git clone` in the directory of your choice, or alternatively download the zip file.
2. Position yourself in the `client-app` folder and run `npm install`.
3. Go to the `server-app` folder and run `npm install` again.

***
To start the client side, do the following:
* Inside `client-app` folder run `npm start` to activate the server with the development version.
* Alternatively you can make a production build by typing `npm run build` and open it with `serve -s build`. This version won't show detailed error output and is optimized.
***

To start the backend API, run these:
* In the `server-app` folder enter `npm start` to open the API in regular mode or hit `npm run debug` to start it in the debug mode with logging output being printed in the terminal window.
* You can also enter `npm run test` to execute all of the defined unit test and see their results.