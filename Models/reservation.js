const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema(
  {
    reserve_time: {
      timestamp: {
        type: Number,
      },
      date: {
        type: String,
      },
      time: {
        type: String,
      },
      time_zone: {
        type: String,
      },
    },
    end_time: {
      timestamp: {
        type: String,
      },
      date: {
        type: String,
      },
      time: {
        type: String,
      },
      time_zone: {
        type: String,
      },
    },
    duration: {
      type: Number,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    customer: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model("reservation", reservationSchema);

module.exports = Reservation;
