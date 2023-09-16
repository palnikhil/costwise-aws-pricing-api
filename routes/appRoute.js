const express = require('express')
const dbRouter = require('./dbRoute');
const appRoute = express.Router();

appRoute.initialize = (app) => {
    app.use('/db',dbRouter);
};

module.exports = appRoute;