import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "../component/SearchBar";
import { Administrator } from "../model/Model";

const AdminHome = ({ loggedInUser, onLogout }) => {
  const [administrator, setAdministrator] = React.useState(new Administrator());
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const receivedData = location.state.userData;
  console.log(receivedData);

  const [venues, setVenues] = useState(location.state.userData.venues);

  const handleSearch = () => {
    console.log(`Search query: ${searchQuery}`);
  };

  async function listVenues() {
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
              <Link to="/">Customer View</Link>
              <Link to="/manager">Manager View</Link>
            </div>

            <div className="middle-container">
              <button onClick={listVenues}>Refresh</button>
              {administrator.venues.length ? (
                <div className="middle-container">
                  <p>You have {venues.length} venues.</p>
                  <p>-------------------------------------------------</p>
                  {venues.map((venue, index) => (
                    <div key={index}>
                      <p>Venue Name: {administrator.venues[index].name}</p>
                      <p>Venue List of shows:</p>
                      {/* {administrator.venues[index].shows.length ? (
                          <div>
                          {administrator.venues[index].shows.map((show, j) => (
                            <div key={j}>
                                {administrator.venues[index].shows[j].name}
                            </div>
                            ))}
                          </div>
                          )
                          :(
                            <div>No shows yet</div>
                          )} */}
                      <p>-------------------------------------------------</p>
                    </div>
                  ))}
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
