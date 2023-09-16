const express = require('express');
const dbRouter = express.Router();
const appController = require('../controllers/infoController');

dbRouter.route('/get').get( async (req, res) => {
    let result = await appController.getServiceinfo(req);
    console.log(result);
    res.status(result.code).send(result);
});

module.exports = dbRouter;