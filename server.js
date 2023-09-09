const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

//create a new booking
app.post("/bookings", function (req, res) {
  const newBooking = req.body;
  if (!req.body.title) {
   res.status(400).send("you cannot submit an empty booking!")
}
  bookings.push(newBooking);
  fs.writeFileSync("./bookings.json", JSON.stringify(bookings));
  res.status(201).send(newBooking);
});

//read all bookings
app.get("/bookings", function (req, res) {
  res.send(bookings);
});

//read one booking, specified by an ID
app.get("/bookings/:id", function (req, res) {
  const requestedId = req.params.id;
  const filteredById = bookings.find((element) => element.id == requestedId);
  if (!filteredById) {
    return res
      .status(404)
      .send(`The booking with id number ${requestedId} was not found!`)
  };
  res.send(filteredById);
});

//Delete a booking, specified by an ID
app.delete("/bookings/:id", (req, res) => {
  const requestedId = req.params.id;
  const filteredById = bookings.find((element) => element.id == requestedId);
  if (!filteredById){
    return res
    .status(404)
    .send(`The booking with id number ${requestedId} was not found!`)
  };
  const findElementIndex = bookings.findIndex((element) => element.id == requestedId);
  bookings.splice(findElementIndex, 1);
  res.status(200).send(`The booking with id number ${requestedId} was succesfully deleted.`);
});

// TODO add your routes and helper functions here



const PORT = 3000;

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
