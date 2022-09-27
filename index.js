
const express = require("express");
const httpErrorHandler = require("http-errors");

require("dotenv").config();
require("./helpers/database.helper");

// routes
const userRoute = require('./routes/accounts.routes');
const authRoute = require('./routes/_auth.routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//error handler
app.use(async (req, res, next) => {
  next(httpErrorHandler.NotFound());
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});

// routes
const base_path = '/pass-sakay-v1/api';
app.use(base_path, userRoute);
app.use(base_path, authRoute);

const port = process.env.PORT || 4101;
app.listen(port, () => {
  console.log("=> Sever is already running....");
  console.log("=> Server is waiting at http://localhost:" + port);
});
