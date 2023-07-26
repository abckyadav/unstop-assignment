import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Snackbar,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";

import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import Cards from "./Cards";
import "./style.css";
const Home = () => {
  const [allSeats, setAllSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [severity, setSeverity] = useState("");
  const [load, setLoad] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = React.useState(false);

  // For fetching all seats details.
  let getAllSeats = async () => {
    setLoad(true);
    try {
      let res = await axios.get(`https://unstop-backend-api.onrender.com/`);
      setLoad(false);
      setAllSeats(res.data.allSeats);
    } catch (error) {
      console.log(error);
      setLoad(false);
      handleToast(error, "error");
    }
  };

  // User input handler
  let handleChange = (e) => {
    setInputValue(e.target.value);

    if (e.target.value < 1 || e.target.value > 7) {
      handleToast("Please enter valid number between 1 and 7", "error");
      setInputValue("");
    }
  };

  //For Booking seats

  let bookSeats = async () => {
    setLoad(true);
    try {
      if (inputValue === "" || +inputValue < 1) {
        setLoad(false);
        handleToast("Please enter valid Number", "error");
      } else if (+inputValue > 7) {
        handleToast("Please enter less than 7", "error");
      } else {
        let res = await axios.patch(
          `https://unstop-backend-api.onrender.com/seats`,
          { seatNo: +inputValue }
        );
        if (!res.data.booked) {
          setLoad(false);
          handleToast(res.data.message, "error");
        } else {
          setBookedSeats(res.data.booked);
          getAllSeats();
          setLoad(false);
          setInputValue("");
          handleToast("Booked Successfully", "success");
        }
      }
    } catch (error) {
      setLoad(false);
      handleToast(error.response.data.message, "error");
    }
  };
  // For reseting all seats.
  let resetAllSeats = async () => {
    setLoad(true);
    try {
      await axios.patch(`https://unstop-backend-api.onrender.com/reset`);

      getAllSeats();
      setInputValue("");
      setBookedSeats([]);
      handleToast("all seats has been reset", "success");
    } catch (error) {
      handleToast(error, "error");
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleToast = (msg, severity) => {
    setLoad(false);
    setOpen(true);
    setMessage(msg);
    setSeverity(severity);
  };

  useEffect(() => {
    getAllSeats();
  }, []);
  console.log("bookedSeats", bookedSeats, message);

  return (
    <div className="root">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} className="leftPanel">
          <div className="heading">
            <Typography variant="h4">Ticket Booking App</Typography>
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
                min="1"
                max="7"
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
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={load}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Grid>
    </div>
  );
};

export default Home;
