const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const moment = require("moment");
const app = express();

app.use(express.json());
app.use(cors());

let newBookingIds = 6;

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//Create a new booking
app.post("/bookings", function (request, response) {
  const newBooking = request.body;
  // newBooking.id = uuid.v4(); This method generates decimal IDs-use a simpler approach for easier testing.
  newBooking.id = newBookingIds++;
  if (
    !newBooking ||
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.roomId ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    response
      .status(400)
      .send("Booking object must not have missing or empty properties.");
  }
  bookings.push(newBooking);
  response.send(newBooking);
});
//Read all bookings
app.get("/bookings", function (request, response) {
  response.send({ bookings });
});
//search by date
app.get("/bookings/search", function (request, response) {
  const searchDate = request.query.date;
  console.log(searchDate);
  if (!moment(searchDate, "YYYY-MM-DD", true).isValid()) {
    response.status(400).send("please enter the correct format: YYYY-MM-DD");
  }
  const searchResult = bookings.filter((booking) => {
    return moment(searchDate).isBetween(
      booking.checkInDate,
      booking.checkOutDate
    );
  });
  response.send(searchResult);
});
//search by text
app.get("/bookings/search", function (request, response) {
  const searchQuery = request.query.term.toLocaleLowerCase();
  console.log("search this", searchQuery);
  const searchResults = bookings.filter(
    (el) =>
      el.firstName.toLowerCase().includes(searchQuery) ||
      el.surname.toLowerCase().includes(searchQuery) ||
      el.email.toLowerCase().includes(searchQuery)
  );
  response.send(searchResults);
});

//Read one booking by  id
app.get("/bookings/:id", function (request, response) {
  const bookingIdToFind = request.params.id;
  const bookingToFind = bookings.find(
    (booking) => booking.id === Number(bookingIdToFind)
  );
  if (bookingToFind) {
    response.send(bookingToFind);
  } else {
    response.status(404).send();
  }
});

//Delete a booking by Id
app.delete("/bookings/:id", function (request, response) {
  const bookingIdToDelete = request.params.id;
  const bookingToDeleteIndex = bookings.findIndex(
    (booking) => booking.id === Number(bookingIdToDelete)
  );
  if (bookingToDeleteIndex != -1) {
    bookings.splice(bookingToDeleteIndex, 1);
    response.status(200).send("Booking has been deleted");
  } else {
    response.status(404).send();
  }
});
const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
