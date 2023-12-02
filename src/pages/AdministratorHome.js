import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "../component/SearchBar";
import { Administrator } from "../model/Model";

// Show component representing a rectangular block
const Venue = ({ name,  onClick }) => (
  <div style={{ 
    border: '1px solid black', 
    padding: '10px', 
    marginBottom: '10px', 
    cursor: 'pointer',
    width: '200px', // Set a fixed width for each block
    boxSizing: 'border-box', // Include padding and border in the width calculation
  }} onClick={onClick}>
    <p><strong>Venue:</strong> {name}</p>
  </div>
);

const AdminHome = ({ loggedInUser, onLogout }) => {
  const [administrator, setAdministrator] = React.useState(new Administrator());
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const receivedData = location.state.userData;
  console.log(receivedData);

  const [venues, setVenues] = useState(location.state.userData.venues);
  const [selectedVenue, setSelectedVenue] = useState(null);

  const handleSearch = () => {
    console.log(`Search query: ${searchQuery}`);
  };

  const handleVenueClick = (index) => {
    console.log(venues);
    setSelectedVenue(venues[index]);
    console.log(venues[index]);
    console.log(venues);
  };

  const handleUnselectVenue = () => {
    setSelectedVenue(null);
  };

  async function listVenues() {
    setLoading(true);
    const res = await fetch(
      "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/listvenues",
      {
        credentials: "include",
        method: "GET",
      }
    );

    const venues = await res.json();
    console.log(venues);
    setVenues(venues);
    setLoading(false);
  }

  administrator.venues = receivedData.venues;

  return (
    <div>
      <div className="center-container">
        <img src="/pictures/logo.png" alt="Logo" width="250" height="100" />
      </div>

      <div>
        {loggedInUser ? (
          <div>
            <div className="upper-right-text">
              <p>
                Welcome back, {loggedInUser.role} {loggedInUser.username}! Now
                you may administrate.
              </p>
              <button onClick={onLogout}>Logout</button>
              {/* <Link to="/">Customer View</Link>
              <Link to="/manager">Manager View</Link> */}
            </div>

            <div className="middle-container">
              {loading ? (
                <p>loading... </p>
              ) : (
                  <div>
                    <button onClick={listVenues}>Refresh</button>
                  </div>
              )}
              {venues.length ? (
                <div>
                  <div style={{ position: 'absolute', left: 640, top:200 }}>
                    {!selectedVenue && (
                      <div>
                        <h3>You have {venues.length} venues.</h3>
                        <h4>List of venues:</h4>
                      </div>
                    )}
                    {!selectedVenue && venues.map((venue, index) => (

                        <Venue key={index} {...venue} onClick={() => handleVenueClick(index)} />
                      ))}
                  </div>
                  <div className="middle-container">
                    {selectedVenue && (
                      <div>
                        <p><strong>Selected Venue:</strong></p>
                        <p><strong>Name:</strong> {selectedVenue.name} <strong>Id:</strong> {selectedVenue.id}</p>
                        <button onClick={handleUnselectVenue}>unselectVenue</button>
                        
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>No venues yet</div>
              )}
            </div>
          </div>
        ) : (
          <div className="upper-right-text">
            <p>Logged out</p>
            <Link to="/">Go back to home page</Link>
            <p>
              Or <Link to="/login">log in</Link> again here
            </p>
          </div>
        )}
      </div>

      {/* <div className="center-container">
          <SearchBar onSearch={handleSearch} /> 
        </div> */}
    </div>
  );
};
export default AdminHome;
