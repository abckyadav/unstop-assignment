const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    seatNo: { type: Number, required: true },
    isBooked: { type: Boolean, default: false },
    rowNo: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Seat", seatSchema);
