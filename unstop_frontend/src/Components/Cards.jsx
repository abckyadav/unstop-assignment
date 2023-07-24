import React from "react";
import { Card } from "@mui/material";
import "./style.css";

const Cards = ({ seatNo, isBooked }) => {
  return (
    <Card
      style={{
        height: "45px",
        width: "45px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isBooked ? "#f73131" : "#479c41",
        borderRadius: "10px",
        boxShadow: "7px 7px 15px #bebebe,-7px -7px 15px #ffffff",
        color: "#fff",
      }}
    >
      {seatNo}
    </Card>
  );
};

export default Cards;
