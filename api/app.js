'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const {sequelize} = require('./models');
const userRoute = require('./routes/users');
const courseRoute = require('./routes/course');
// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// setup cors 
app.use(cors());

app.use(express.json());

(async ()=>{
  try{
    sequelize.authenticate();
    console.log('Connect to Database successfully.');
  } catch (error){
    console.error('Failed to connect to the Database: ',error);
  }
})();

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

app.use('/api/users', userRoute);
app.use('/api/courses', courseRoute);
// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
