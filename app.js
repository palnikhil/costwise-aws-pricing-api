const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const appRoute = require('./routes/appRoute')
const cors = require('cors');

const initializeServer = async() => {
  const PORT = process.env.PORT | 8000;
  const app = express();
  app.use(cors());
  appRoute.initialize(app);
  app.listen(PORT, ()=>
       console.log('AWS Services Pricing APIs is running on port: ',PORT)
  );
};

initializeServer();