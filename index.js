const express = require("express");
const cors = require("cors");
const httpErrorHandler = require("http-errors");

require("dotenv").config();
require("./helpers/database.helper");

// routes
const accountRoute = require("./routes/accounts.routes");
const authRoute = require("./routes/_auth.routes");
const passengerRoute = require("./routes/passengers.routes");
const busDriverRoute = require("./routes/bus-drivers.routes");
const scannedQRRoute = require("./routes/scanned-qr.routes");
const tripScheduleRoute = require("./routes/trip-schedule.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/pass-sakay-v1/api", authRoute);
app.use("/pass-sakay-v1/api", accountRoute);
app.use("/pass-sakay-v1/api", passengerRoute);
app.use("/pass-sakay-v1/api", busDriverRoute);
app.use("/pass-sakay-v1/api", scannedQRRoute);
app.use("/pass-sakay-v1/api", tripScheduleRoute);

//error handler
app.use(async (req, res, next) => {
  next(httpErrorHandler.NotFound());
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const port = process.env.PORT || 4101;
app.listen(port, () => {
  console.log("=> Sever is already running....");
  console.log("=> Server is waiting at http://localhost:" + port);
});
