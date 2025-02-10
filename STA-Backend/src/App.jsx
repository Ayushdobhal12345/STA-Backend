import React, { useState, useEffect } from "react";
import { signUp, signIn, logOut, fetchUserData, fetchBookingData, auth } from "./firebase"; 
import './App.css'; // This imports the CSS file into your App.jsx
import { onAuthStateChanged } from 'firebase/auth'; 

function App() {
  const [userData, setUserData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [user, setUser] = useState(null); // Store authenticated user
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Monitor authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Fetch user data and booking data if authenticated
    if (user) {
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
    }

    return unsubscribe;
  }, [user]);

  const handleSignUp = (e) => {
    e.preventDefault();
    setError(null);
    signUp(email, password)
      .then(() => {
        setIsSignUp(false); // Switch to sign-in after successful sign-up
      })
      .catch((error) => setError(error.message));
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setError(null);
    signIn(email, password)
      .catch((error) => setError(error.message));
  };

  const handleLogOut = () => {
    logOut()
      .catch((error) => setError(error.message));
  };

  return (
    <div className="App">
      {/* Conditionally render h2 based on user authentication status */}
      {!user && <h2>Authenticate Yourself</h2>} 

      {user ? (
        <div>
          <h2>Welcome, {user.email}</h2>
          <button onClick={handleLogOut}>Log Out</button>

          {/* Conditionally render User Data and Booking Data tables only after login */}
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
      ) : (
        <div>
          <h3>{isSignUp ? 'Sign Up' : 'Sign In'}</h3>
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
          </form>
          <p>{isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
            <button onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
}

export default App;
