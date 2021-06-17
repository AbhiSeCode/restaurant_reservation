const express = require("express");
const RequestParameter = require("../Models/requestParameters");
const response = require("../utils/response");
const Reservation = require("../Models/reservation");
const router = express.Router();

router.get("/setparameter", async (req, res) => {
  try {
    await RequestParameter.deleteMany({});
    const parameters = new RequestParameter();
    await parameters.save();
    res.status(200).send(response(1, "Parameter set"));
  } catch (err) {
    res.status(400).send(response(0, err.message));
  }
});
router.post("/resetparameter", async (req, res) => {
  try {
    const { seat_capacity, duration_default } = req.body;
    const parameters = await RequestParameter.findOne({});
    parameters.seat_capacity = seat_capacity
      ? seat_capacity
      : parameters.seat_capacity;
    parameters.duration_default = duration_default
      ? duration_default
      : parameters.duration_default;
    await parameters.save();
    res.status(200).send(response(1, "Parameters updated"));
  } catch (err) {
    res.status(400).send(response(0, err.message));
  }
});

router.post("/make", async (req, res) => {
  try {
    const parameters = await RequestParameter.findOne({});
    const { name, email, guests, timestamp } = req.body;
    const weekDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thrusday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let status = {};
    if (!name || !email || !guests || !timestamp) {
      throw new Error("All details required");
    }
    if (guests > 20) {
      status.flag = 2;
      status.message =
        "You can only reserve upto 20 seats online. Contact restaurant at 8534033595 for your requirement.";
    } else {
      const duration = req.body.duration
        ? req.body.duration
        : parameters.duration_default;
      const x = new Date(timestamp);
      const date = x.toLocaleDateString();
      const time = x.toLocaleTimeString();
      const time_zone = /\((.*)\)/.exec(x.toString())[1];
      const reservations = await Reservation.find({
        "reserve_time.date": date,
      });
      let occupiedSeats = 0;
      const timeReservations = reservations.filter((data) => {
        const totalTime = new Date(
          data.reserve_time.timestamp + data.duration * 60000
        ).getTime();
        if (data.reserve_time.timestamp > timestamp) {
          const userTotalTime = new Date(
            timestamp + duration * 60000
          ).getTime();
          if (userTotalTime > data.reserve_time.timestamp) {
            occupiedSeats += data.guests;
            data.totalTime = userTotalTime;
            return data;
          }
        } else if (
          data.reserve_time.timestamp === timestamp ||
          totalTime > timestamp
        ) {
          occupiedSeats += data.guests;
          data.totalTime = totalTime;
          return data;
        }
      });
      seats_left = occupiedSeats + guests;
      if (seats_left > parameters.seat_capacity) {
        timeReservations.sort((a, b) =>
          a.totalTime > b.totalTime ? 1 : b.totalTime > a.totalTime ? -1 : 0
        );
        const timeSlots = [];
        let meetRequirement = 0;
        timeReservations.forEach((data) => {
          meetRequirement += data.guests;
          if (timeSlots.length === 3) return;
          if (meetRequirement === guests || meetRequirement > guests) {
            timeSlots.push(new Date(data.totalTime).toLocaleTimeString());
          }
        });
        status.flag = 0;
        status.message = `Unfortunately we only have space for ${guests} people at: ${timeSlots[0]}, ${timeSlots[1]} and ${timeSlots[2]}`;
      } else {
        const reservation = new Reservation({
          customer: { name, email },
          reserve_time: { timestamp, date, time, time_zone },
          duration,
          guests,
        });
        await reservation.save();
        status.flag = 1;
        status.message = `Your reservation has been made for ${
          weekDays[x.getDay()]
        }, ${
          months[x.getMonth()]
        } ${x.getDate()} @${x.getHours()}:${x.getMinutes()} for ${guests} people. ${name} ${email}`;
      }
    }
    res.status(200).send(response(status.flag, status.message));
  } catch (err) {
    res.status(400).send(response(0, err.message, err));
  }
});
module.exports = router;
