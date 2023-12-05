import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import SearchBar from "../component/SearchBar";
import SpecificSearchBar from "../component/SpecificSearchBar";
import { Administrator } from "../model/Model";
import { deleteShowAdminC } from '../controller/Controller';

// Show component representing a rectangular block
const Show = ({ name, date, time, venue, onClick, id, active }) => (
  <div style={{ 
    border: '1px solid black', 
    padding: '10px', 
    marginBottom: '10px', 
    cursor: 'pointer',
    width: '200px', // Set a fixed width for each block
    boxSizing: 'border-box', // Include padding and border in the width calculation
  }} onClick={onClick}>
    <p><strong>Show:</strong> {name}</p>
    <p><strong>Date:</strong> {date}</p>
    <p><strong>Time:</strong> {time}</p>
    <p><strong>Venue:</strong> {venue}</p>
    <p><strong>Status:</strong> {active}</p>
    <p><strong>Id:</strong> {id}</p>
    {/* <p><strong>Date:</strong> {date.split("T")[0]}</p>
    <p><strong>Time:</strong> {date.split("T")[1].split("Z")[0]}</p> */}
  </div>
);

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

  const [listOfShows, setListOfShows] = useState([]);

  const [hideList, setHideList] = useState(true);

  const hideListOfShows = () => {
    setHideList(true);
    setListOfShows([]);
  }


  async function handleSearch(query) {
    setSearchQuery((prevQuery) => {
  
      // Define an async function to perform the API call
      const fetchData = async () => {
        try {
          console.log(`Search query: ${query}`);
          const res = await fetch(
              "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/searchevents",
              {
                  credentials: "include",
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ "searchQuery": query}),
              }
          );
          const data = await res.json();
          setListOfShows(data.events);
          setHideList(false);
        } catch (error) {
            console.error("Error occurred while searching show:", error);
        }
  
        // Continue with any other logic after the API call
        console.log('API call completed');
      };
  
      // Call the async function immediately
      fetchData();
  
      // Return the new state value to update the state
      return query;
    });
  }

  const handleVenueClick = (index) => {
    console.log(venues);
    setSelectedVenue(venues[index]);
    console.log(venues[index]);
    console.log(venues);
  };

  const handleUnselectVenue = () => {
    setSelectedVenue(null);
    setListOfShows([]);
    setHideList(true);
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

  const [selectedShow, setSelectedShow] = useState(null);

  const handleShowClick = (index) => {
    setSelectedShow(listOfShows[index]);
  };

  const handleUnselectShow = () => {
    setSelectedShow(null);
  };

  const handleDeleteShow = () => {
    console.log(selectedShow.event_id)
    deleteShowAdminC(selectedShow.event_id);
    setListOfShows(prevShows => prevShows.filter(show => show !== selectedShow));
    setSelectedShow(null);
  };

  return (
    <div>
      <div className="center-container">
        <img src="/pictures/logo.png" alt="Logo" width="250" height="100" />
      </div>
      <div>
        {loggedInUser && (
          <div style={{ position: 'absolute', left: 650, top:120 }}>
              {/* <SearchBar onSearch={handleSearch} />  */}
          </div>
        )}
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
                  <div style={{ position: 'absolute', left: 530, top:200 }}>
                    {!selectedVenue && (
                      <div>
                        <h3>You have {venues.length} venues.</h3>
                        <h4>List of venues:</h4>
                      </div>
                    )}
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                      {!selectedVenue && venues.map((venue, index) => (
                          <Venue key={index} {...venue} onClick={() => handleVenueClick(index)} />
                        ))}
                    </div>
                  </div>
                  <div className="middle-container">
                    {selectedVenue && (
                      <div>
                        <p><strong>Selected Venue:</strong></p>
                        <p><strong>Name:</strong> {selectedVenue.name} <strong>Id:</strong> {selectedVenue.id}</p>
                        <button onClick={handleUnselectVenue}>unselectVenue</button>
                        <button>generate show report</button>
                        {!selectedShow && hideList && (
                          <SpecificSearchBar onSearch={handleSearch} initialSearchQuery={selectedVenue.name} />
                        )}
                        {!hideList && (
                          <button onClick={hideListOfShows}>Hide list</button>
                        )}
                        <div style={{display: 'flex', flexWrap: 'wrap'}}>
                          {!selectedShow && listOfShows.map((event, index) => (
                            <Show
                              key={index}
                              name={event.event_name}
                              date={new Date(event.event_date).toLocaleDateString()}
                              time={new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                              venue={event.venue_name}
                              id={event.event_id}
                              active={event.event_active}
                              onClick={() => handleShowClick(index)}
                            />
                          ))}
                          {selectedShow && (
                            <div>
                              <Show
                                name={selectedShow.event_name}
                                date={new Date(selectedShow.event_date).toLocaleDateString()}
                                time={new Date(selectedShow.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                venue={selectedShow.venue_name}
                                active={selectedShow.event_active}
                                id={selectedShow.event_id}
                              />
                              <button onClick={handleUnselectShow}>unselectShow</button>
                              <button onClick={handleDeleteShow}>deleteShow</button>
                            </div>
                          )}
                        </div>
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
    </div>
  );
};
export default AdminHome;
