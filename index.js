const express = require("express");
const mongoose = require("mongoose");
const reservationRoute = require("./Routes/reservationRoute");
require("dotenv").config();

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("database connected successsfully");
});
const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());

app.use("/reservation", reservationRoute);

app.listen(port, () => console.log(`Listening on ${port}`));
