const errorHandle = (req, res, next) => {
  const seatNeeded = req.body.seatNo;

  if (seatNeeded > 0 && seatNeeded <= 7) {
    next();
  } else {
    return res
      .status(400)
      .json({ message: "You can only book 7 seats at once" });
  }
};

module.exports = errorHandle;
