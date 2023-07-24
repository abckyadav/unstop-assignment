const mongoose = require("mongoose");

const connectMongoDB = () => {
  return mongoose.connect(
    `mongodb+srv://anu250867anu:anu250867anu@train-reservation.hrbmxvw.mongodb.net/?retryWrites=true&w=majority`
  );
};

module.exports = connectMongoDB;
