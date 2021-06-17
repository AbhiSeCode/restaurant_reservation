const mongoose = require("mongoose");

const requestParameterSchema = mongoose.Schema({
  duration_default: {
    type: Number,
    default: 20,
  },
  seat_capacity: {
    type: Number,
    default: 100,
  },
});

const RequestParameters = mongoose.model(
  "requestParameter",
  requestParameterSchema
);

module.exports = RequestParameters;
