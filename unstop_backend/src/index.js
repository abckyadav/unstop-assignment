const express = require("express");
const app = express();
const connectMongoDB = require("../src/config/db");
const seatRoutes = require("./routes/seatRoutes");
const cors = require("cors");

require("dotenv").config();

const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());
app.use("/", seatRoutes);

app.listen(port, async () => {
  try {
    await connectMongoDB();
    console.log(`listening on port ${port}`);
  } catch (error) {
    console.log("error", error);
  }
});
