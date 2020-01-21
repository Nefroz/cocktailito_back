const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const logger = require('tracer').console();
const db = require('./data');
const async = require("async");
const app = express();

// let sequelize = require('./core/connection');
// const modelUser = require('./core/User.js');
// const modelEqui = require('./core/Equi.js');
// const modelReserv = require('./core/Reserv.js');
// const modelDetail = require('./core/Detail.js');
// db.sequelize.sync({alter:true})
/*db.sequelize.sync({force:true})*/

const roomsRoutes = require('./appHost/rooms');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use('core/ressources/images', express.static(path.join(__dirname, 'images')));
app.use('/api/rooms', roomsRoutes);

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = app;