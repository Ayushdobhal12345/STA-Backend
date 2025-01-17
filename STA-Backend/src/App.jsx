import React, { useState, useEffect } from "react";
import { fetchUserData, fetchBookingData } from "./firebase"; // Ensure these imports are correct
import './App.css'; // This imports the CSS file into your App.jsx

function App() {
  const [userData, setUserData] = useState([]);
  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    // Fetch user data
    fetchUserData()
      .then((snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          const usersArray = Object.keys(users).map((key) => ({
            id: key,
            ...users[key],
          }));
          setUserData(usersArray);
        }
      })
      .catch((error) => console.error("Error fetching user data: ", error));

    // Fetch booking data
    fetchBookingData()
      .then((snapshot) => {
        if (snapshot.exists()) {
          const bookings = snapshot.val();
          const bookingsArray = Object.keys(bookings).map((key) => ({
            id: key,
            ...bookings[key],
          }));
          setBookingData(bookingsArray);
        }
      })
      .catch((error) => console.error("Error fetching booking data: ", error));
  }, []);

  return (
    <div className="App">
      <h2>User Data:</h2>
      {userData.length === 0 ? (
        <p>No user data available</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2>Booking Data:</h2>
      {bookingData.length === 0 ? (
        <p>No booking data available</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {bookingData.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.name}</td>
                  <td>{booking.phone}</td>
                  <td>{booking.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
