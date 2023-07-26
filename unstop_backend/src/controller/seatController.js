const SeatModel = require("../models/seatModel");

const getAllSeats = async (req, res) => {
  try {
    const allSeats = await SeatModel.find().sort({ seatNo: 1 });
    console.log("allSeats:", allSeats);

    return res.status(200).json({ allSeats: allSeats });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const createSeats = async (req, res) => {
  try {
    await SeatModel.collection.drop();
    const seats = [];
    let seatNo = 1;
    let rowNo = 1;

    for (let i = 1; i <= 80; i++) {
      let seatObj = { seatNo, rowNo, isBooked: false };
      seats.push(seatObj);

      seatNo++;
      rowNo = Math.ceil(seatNo / 7);
    }

    const insertedData = await SeatModel.insertMany(seats);
    console.log(insertedData.length);
    return res.status(200).json({ insertedData: insertedData });
  } catch (error) {
    console.log("error:", error);
    return res.json({ error: error.message });
  }
};

const bookSeats = async (req, res) => {
  const seats = req.body.seatNo;
  try {
    const totalAvailableSeats = await SeatModel.find({ isBooked: false });

    if (totalAvailableSeats.length === 0) {
      return res.status(400).json({ message: `No seats are available` });
    } else if (totalAvailableSeats.length < seats) {
      return res.status(400).json({
        message: `only ${totalAvailableSeats.length} seats are available`,
      });
    }

    let seatsAvailableInOneRow = [];

    for (let i = 1; i < totalAvailableSeats.length; i++) {
      if (seatsAvailableInOneRow.length == seats) {
        break;
      }

      if (totalAvailableSeats[i - 1].rowNo === totalAvailableSeats[i].rowNo) {
        seatsAvailableInOneRow.push(totalAvailableSeats[i - 1]);
        if (seatsAvailableInOneRow.length === seats - 1) {
          seatsAvailableInOneRow.push(totalAvailableSeats[i]);
          break;
        }
      } else {
        seatsAvailableInOneRow = [];
      }
    }

    if (seatsAvailableInOneRow.length === seats) {
      const bookedSeats = [];
      for (let i = 0; i < seatsAvailableInOneRow.length; i++) {
        seatsAvailableInOneRow[i].isBooked = true;
        await seatsAvailableInOneRow[i].save();
        bookedSeats.push(seatsAvailableInOneRow[i].seatNo);
      }
      console.log("seatsAvailableInOneRow:", bookedSeats);
      return res.status(200).json({ booked: bookedSeats });
    } else {
      let bookedSeats = [];
      let nearestSeats = [];
      var minDistance = Infinity;
      var distance = Infinity;
      var startIndex = 0;
      var endIndex = seats;

      for (let i = 0; i <= totalAvailableSeats.length - seats; i++) {
        distance =
          totalAvailableSeats[seats + i - 1].seatNo -
          totalAvailableSeats[i].seatNo;
        if (distance < minDistance) {
          minDistance = distance;
          startIndex = i;
          endIndex = seats + i;
        }
      }
      for (let i = startIndex; i < endIndex; i++) {
        nearestSeats.push(totalAvailableSeats[i]);
      }

      for (let i = 0; i < nearestSeats.length; i++) {
        nearestSeats[i].isBooked = true;
        await nearestSeats[i].save();
        bookedSeats.push(nearestSeats[i].seatNo);
      }
      console.log("nearestSeats:", bookedSeats);
      return res.status(200).json({ booked: bookedSeats });
    }
  } catch (error) {
    console.log("error", error.message);
    console.log(error.message);
  }
};

const resetSeats = async (req, res) => {
  try {
    await SeatModel.updateMany({}, { $set: { isBooked: false } });
    return res.status(200).json({ message: "All seats has been reset" });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

module.exports = { getAllSeats, bookSeats, resetSeats, createSeats };
