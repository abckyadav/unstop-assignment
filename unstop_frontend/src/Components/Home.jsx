import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  IconButton,
  Typography,
  Snackbar,
} from "@mui/material";

import axios from "axios";
import Cards from "./Cards";
import "./style.css";

const Home = () => {
  const [allSeats, setAllSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [load, setLoad] = useState(false);
  const [load2, setLoad2] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = React.useState(false);

  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" color="inherit"></IconButton>
    </React.Fragment>
  );

  // For fetching all seats details.
  let getAllSeats = async () => {
    setLoad2(true);
    try {
      let res = await axios.get(`https://unstop-backend-api.onrender.com/`);
      setLoad2(false);
      console.log("res.data.allSeats:", res.data.allSeats);
      setAllSeats(res.data.allSeats);
    } catch (error) {
      console.log(error);
    }
  };

  // User input handler
  let handleChange = (e) => {
    setInputValue(e.target.value);

    if (e.target.value < 1 || e.target.value > 7) {
      setOpen(true);
      setMessage("Please enter valid number between 1 and 7");
    }
  };

  //For Booking seats

  let bookSeats = async () => {
    setLoad(true);
    try {
      if (inputValue === "" || +inputValue < 1) {
        console.log("Please enter valid Number");
        setLoad(false);
      } else if (+inputValue > 7) {
        console.log("Please enter lestt than 7");
      } else {
        let res = await axios.patch(
          `https://unstop-backend-api.onrender.com/seats`,
          { seatNo: +inputValue }
        );
        if (!res.data.booked) {
          setLoad(false);
          setMessage(res.data.message);
          console.log("res.data.message:", res.data.message);
        } else {
          setBookedSeats(res.data.booked);
          getAllSeats();
          setLoad(false);
          setInputValue("");
        }
      }
    } catch (error) {
      setMessage(error.response.data.message);
      console.log(error.response.data.message);
    }
  };
  // For reseting all seats.
  let resetAllSeats = async () => {
    setLoad2(true);
    try {
      await axios.patch(`https://unstop-backend-api.onrender.com/reset`);

      getAllSeats();
      setInputValue("");
      setBookedSeats([]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllSeats();
  }, [bookedSeats]);
  console.log("bookedSeats", bookedSeats, message);

  return (
    <div className="root">
      <Snackbar
        open={open}
        autoHideDuration={6000}
        message={message}
        action={action}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} className="leftPanel">
          <div className="heading">
            <Typography variant="h4">Ticket Booing App</Typography>
          </div>

          <Grid container xs={12} className="controls">
            <Grid item xs={10}>
              <TextField
                label="Please enter number of seats"
                fullWidth
                variant="outlined"
                onChange={handleChange}
                value={inputValue}
                type="number"
                required
              />
            </Grid>
            <Grid item container xs={12} className="controls">
              <Grid item>
                <Button variant="contained" color="primary" onClick={bookSeats}>
                  Book
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={resetAllSeats}
                >
                  Reset All Seats
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={6}></Grid>
          </Grid>

          {bookedSeats.length > 0 && (
            <Grid container xs={12} className="controls">
              <Grid item xs={12} margin={3} className="heading">
                <Typography variant="h4">Recently Booked Seats</Typography>
              </Grid>

              <Grid item XS={12}>
                <div className="cards">
                  {bookedSeats &&
                    bookedSeats.map((data, index) => (
                      <Cards seatNo={data} isBooked="false" />
                    ))}
                </div>
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} sm={6} className="rightPanel">
          <div className="legends">
            <div
              className="legendcircle"
              style={{ background: "#f73131" }}
            ></div>
            <Typography>Reserved</Typography>
            <div
              className="legendcircle"
              style={{ background: "#479c41" }}
            ></div>
            <Typography>Unreserved</Typography>
          </div>
          <div className="cards">
            {allSeats.map((data, index) => (
              <Cards seatNo={data.seatNo} isBooked={data.isBooked} />
            ))}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
