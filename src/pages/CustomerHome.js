import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../component/SearchBar';

// Show component representing a rectangular block
const Show = ({ name, date, time, venue, onClick }) => (
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
    {/* <p><strong>Date:</strong> {date.split("T")[0]}</p>
    <p><strong>Time:</strong> {date.split("T")[1].split("Z")[0]}</p> */}
  </div>
);

const CustomerHome = ({ loggedInUser, onLogout }) => {

  const [search, setSearch] = useState(false);
  const [list, setList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [listOfShows, setListOfShows] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedShowList, setSelectedShowList] = useState(null);

  const handleShowClick = (index) => {
    setSelectedShow(searchResults[index]);
  };

  const handleShowClickList = (index) => {
    setSelectedShowList(listOfShows[index]);
  };

  const handleUnselectShow = () => {
    setSelectedShow(null);
  };

  const handleUnselectShowList = () => {
    setSelectedShowList(null);
  };

  async function handleSearch(query) {
    setLoadingSearch(true);
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
          const data= await res.json();
          console.log(data);
          setSearch(true);
          setList(false);
          setLoadingSearch(false);
          const filteredEvents = data.events.filter(event => event.event_active);
          setSearchResults(filteredEvents);
        } catch (error) {
            console.error("Error occurred while searching show:", error);
        }
      };
  
      // Call the async function immediately
      fetchData();
  
      // Return the new state value to update the state
      return query;
    });
  }

  async function listActiveShows() {
    setLoadingList(true);
    const res = await fetch(
      "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/listevents",
      {
        credentials: "include",
        method: "GET",
      }
    );

    const data = await res.json();
    setSearch(false);
    setList(true);
    const filteredEvents = data.events.filter(event => event.active);
    setListOfShows(filteredEvents);
    setLoadingList(false);
  }


  return (
    <div>
        <div className="center-container">
          <img src='/pictures/logo.png' alt="Logo" width="250" height="100" />
        </div>

        {!selectedShow && !selectedShowList && (
          <div className="center-container">
              <h4>For customers, you may search shows by (partial) show name and venue name here</h4>
              {loadingSearch ? (
                <p>loading... </p>
              ) : (
                  <div>
                    <SearchBar onSearch={handleSearch} /> 
                  </div>
              )}
              <h4>Otherwise, you may list all active shows here</h4>
              {loadingList ? (
                <p>loading... </p>
              ) : (
                  <div>
                    <button onClick={listActiveShows}>List Active Shows</button>
                  </div>
              )}
          </div>
        )}
        
        <div className="upper-right-text">
          {/* {loggedInUser ? (
            <div>
              <p>Welcome back, {loggedInUser.role} {loggedInUser.username}! Now you may purchase tickets.</p>
              <button onClick={onLogout}>Logout</button>
            </div>
          ) : (
              <p>Please <Link to="/login">log in</Link> here.</p>
          )} */}
          <p>Please <Link to="/login">log in</Link> here.</p>
        </div>

        <div style={{ position: 'absolute', left: 100, top: 350, display: 'flex', flexWrap: 'wrap' }}>
          {search && !selectedShow && searchResults && searchResults.map((event, index) => (
            <Show
              key={index}
              name={event.event_name}
              date={new Date(event.event_date).toLocaleDateString()}
              time={new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              venue={event.venue_name}
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
              />
              <button onClick={handleUnselectShow}>unselectShow</button>
            </div>
          )}
          {list && !selectedShowList && listOfShows.map((event, index) => (
            <Show
              key={index}
              name={event.name}
              date={new Date(event.date).toLocaleDateString()}
              time={new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              venue={event.venue_id}
              onClick={() => handleShowClickList(index)}
            />
          ))}
          {selectedShowList && (
            <div>
              <Show
                name={selectedShowList.name}
                date={new Date(selectedShowList.date).toLocaleDateString()}
                time={new Date(selectedShowList.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                venue={selectedShowList.venue_id}
              />
              <button onClick={handleUnselectShowList}>unselectShow</button>
            </div>
          )}
        </div>

        {/* <div className="lower-right-text">
          {loggedInUser && loggedInUser.role === "Manager" ? (
            <div>
              <p>Now you are in Customer view.</p>
              <Link to="/manager">Go back to Manager View</Link>
            </div>
          ) : (
              <p></p>
          )}

          {loggedInUser && loggedInUser.role === "Administrator" ? (
              <div>
                <p>Now you are in Customer view.</p>
                <Link to="/admin">Go back to Admin View</Link>
              </div>
          ) : (
              <p></p>
          )}
        </div> */}
    </div>
  );
};

export default CustomerHome;