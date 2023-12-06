import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import SearchBar from "../component/SearchBar";
//import SpecificSearchBar from "../component/SpecificSearchBar";
import { Administrator } from "../model/Model";
import { deleteShowAdminC, createVenueC, deleteVenueC, createShowAdminC, deleteShowC, activateShowAdminC } from '../controller/Controller';

// Seat component representing a clickable seat
const Seat = ({ row, col, onClick, selected, blocked }) => (
  <div
    style={{
      border: '1px solid black',
      padding: '4px',
      margin: '2px',
      cursor: 'pointer',
      backgroundColor:
      selected && !blocked
        ? 'lightblue' // Light blue when selected and not blocked
        : blocked && !selected
        ? 'blue' // Blue when blocked and not selected
        : 'white', // White when neither selected nor blocked
    }}
    onClick={() => onClick(row, col)}
  >
    {`${String.fromCharCode(64 + row).toUpperCase()}-${col}`}
  </div>
);

// Section component containing a grid of seats
const Section = ({ title, rows, cols, canSelect }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [blockedSeats, setBlockedSeats] = useState([]);
  const [blocks, setBlocks] = useState([]);

  const handleSeatClick = (row, col, maxCols) => {
    if (canSelect) {
      // Check if the seat is already selected
      const isSeatSelected = selectedSeats.some(seat => seat.row === row && seat.col === col);

      if (!isSeatSelected) {
        // Add the selected seat to the list
        // setSelectedSeats(prevSeats => [...prevSeats, { row, col }]);
        // console.log(row);
        // console.log(col);
        for (let col = 1; col < maxCols+1; col++) {
          setSelectedSeats(prevSeats => [...prevSeats, { row, col }]);
          console.log(row);
          console.log(col);
          console.log(selectedSeats);
        }
      } else {
        // Remove the selected seat from the list if it's already selected
        for (let col = 1; col < maxCols+1; col++) {
          setSelectedSeats(prevSeats => prevSeats.filter(seat => !(seat.row === row && seat.col === col)));
        }
      }
    }
  };

  // useEffect(() => {
  //   console.log(selectedSeats);
  // }, [selectedSeats]); 

  const addBlock = () => {
    if (selectedSeats.length > 0) {
      console.log(selectedSeats);
      setBlockedSeats(prevSeats => [...prevSeats, ...selectedSeats]);
      setBlocks(prevBlocks => [...prevBlocks, selectedSeats]);
      setSelectedSeats([]);
    }
  };

  return (
    <div style={{ padding: '4px' }}>
      <h4>{title}</h4>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: rows }, (_, rowIndex) => (
          Array.from({ length: cols }, (_, colIndex) => (
            <Seat
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex + 1}
              col={colIndex + 1}
              onClick={() => handleSeatClick(rowIndex + 1, colIndex + 1, cols)}
              selected={selectedSeats.some(seat => seat.row === rowIndex + 1 && seat.col === colIndex + 1)}
              blocked={blockedSeats.some(seat => seat.row === rowIndex + 1 && seat.col === colIndex + 1)}
            />
          ))
        ))}
      </div>

      {selectedSeats.length > 0 && (
        <div>
          <h3>Selected Seats</h3>
          {selectedSeats.map((seat, index) => (
            <p key={index}>{`Row: ${String.fromCharCode(64 + seat.row).toUpperCase()}, Column: ${seat.col}`}</p>
          ))}
          <button onClick={addBlock}>Add block</button>
        </div>
      )}
      {blocks.length > 0 && blocks.map((block, index) => (
          <div>
            <p>Block</p>
            <span key={index}>
              {block.length > 0 &&
                block.map((seat, j) => (
                  <p key={j}>{`${String.fromCharCode(64 + seat.row).toUpperCase()}-${seat.col}`}</p>
                ))}
            </span>
          </div>
        ))}
    </div>
  );
};

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
  const [ticketPrice, setTicketPrice] = useState(null);
  const [leftRow, setLeftRow] = useState('');
  const [leftCol, setLeftCol] = useState('');
  const [rightRow, setRightRow] = useState('');
  const [rightCol, setRightCol] = useState('');
  const [centerRow, setCenterRow] = useState('');
  const [centerCol, setCenterCol] = useState('');
  const [showCreating, setShowCreating] = useState(false);
  const [showName, setShowName] = useState('');
  const [showDate, setShowDate] = useState('');
  const [showTime, setShowTime] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  

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
  const addShow = (newShow) => {
    setListOfShows((prevShows) => [...prevShows, newShow]);
  };

  async function listShows() {
    // console.log(manager.id);
    //setLoadingList(true);
    const res = await fetch(
      "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/listevents",
      {
        credentials: "include",
        method: "GET",
      }
    );

    const data = await res.json();



    setListOfShows(data.events);
    setListOfShows([]);
    data.events.map(event => {
      // Call addShow for each event
      event.venue_id === selectedVenue.id && addShow({
        name: event.name,
        date: new Date(event.date).toLocaleDateString(),
        time: new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        id: event.id,
        active: event.active,
      });});

    data.sections.map(section => {
      // Call addShow for each event
      section.venue_id === selectedVenue.id && updateDict(section.venue_id, [section.row_count, section.col_count]);
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
    setSelectedShow(null);
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
    console.log(selectedShow.id)
    deleteShowAdminC(selectedShow.id);
    setListOfShows(prevShows => prevShows.filter(show => show !== selectedShow));
    setSelectedShow(null);
  };

  const activateShow = () => {
    console.log(selectedShow.id);
    selectedShow.active = 1;
    activateShowAdminC(selectedShow.id);
  };
  const [layoutDict, setLayoutDict] = useState({
    //1: [10, 20],
  });

  // useEffect(() => {
  //   console.log(layoutDict);
  // }, [layoutDict]); 

  // Function to add or update a value in the dictionary
  const updateDict = (key, list) => {
    setLayoutDict((prevDictionary) => {
      const existingSection = prevDictionary[key] || [];
      if (existingSection.length >= 6) {
        return prevDictionary; // Do nothing and return the current state
      }
      const newSection = existingSection.concat(list);

      return {
        ...prevDictionary,
        [key]: newSection,
      };
    });
  };

  const getLayout = (venueId, num) => {
    let layout = layoutDict[venueId]
    console.log(layoutDict[venueId])
    let result = layout[num]
    return result;
  };

  async function createBlock(){
    
    try {
        const res = await fetch(
        "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/createblocks",
        {
            credentials: "include",
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(
              [
                {
                  "eventId": selectedShow.id,
                  "sectionId": null,
                  "price": ticketPrice,
                  "startRow": 1,
                  "endRow": 1
                }
              ]
            ),
        }
        );

        // const data = await res.json();
        // console.log(data)
        setTicketPrice(null);
    } catch (error) {
        console.error("Error occurred during creating blocks:", error);
    }
  }
  const creatingShow = () => {
    setShowCreating(true);
  }

  const formatDateTime = (date, time) => {
    const year = Math.floor(date / 10000);
    const month = Math.floor((date % 10000) / 100);
    const day = date % 100;

    const hours = Math.floor(time / 100);
    const minutes = time % 100;

    return `${year.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
const handleDateTimeChange = (datetimeString) => {
  const selectedDate = new Date(datetimeString); // Convert string to Date object
  if (!isNaN(selectedDate)) {
      // Check if the conversion was successful
      const year = selectedDate.getFullYear(); // Extract YYYY
      const month = selectedDate.getMonth() + 1; // GetMonth is zero-based
      const day = selectedDate.getDate();

      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();

      // Convert date and time
      setShowDate(year * 10000 + month * 100 + day);
      setShowTime(hours * 100 + minutes);
  }
};

const displayDate = (date) => {
  const year = Math.floor(date / 10000);
  const month = Math.floor((date % 10000) / 100);
  const day = date % 100;
  return `Date: Month ${month.toString().padStart(2, '0')} / Day ${day.toString().padStart(2, '0')} / Year ${year}`;
};

const displayTime = (time) => {
  const hour = Math.floor(time / 100);
  const minute = time % 100;
  return `Time: ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

const createShow = () => {
  setSubmitLoading(true);
  const year = Math.floor(showDate / 10000);
  const month = Math.floor((showDate % 10000) / 100);
  const day = showDate % 100;
  const hours = Math.floor(showTime / 100);
  const minutes = showTime % 100;
  
  // Call createShowC with await if it returns a Promise
  createShowAdminC(selectedVenue.id , showName, showDate, showTime);
      // Use setTimeout to introduce a delay
      setTimeout(() => {
      setShowName('');
      setShowDate('');
      setShowTime('');
      setShowCreating(false);
      setSubmitLoading(false);
      }, 2000);

};
const handleBackCreateShow = () => {
  setShowCreating(false);
}

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
                    {selectedVenue && !showCreating && (
                      <div>
                        <p><strong>Selected Venue:</strong></p>
                        <p><strong>Name:</strong> {selectedVenue.name} <strong>Id:</strong> {selectedVenue.id}</p>
                        <button onClick={handleUnselectVenue}>unselectVenue</button>
                        <button>generate show report</button>
                        <button onClick={creatingShow}>Create show</button>
                        {!selectedShow && hideList && (
                          <button onClick={listShows}>Get list of shows in this venue</button>
                          // <SpecificSearchBar onSearch={handleSearch} initialSearchQuery={selectedVenue.name} />
                        )}
                        {!hideList && (
                          <button onClick={hideListOfShows}>Hide list</button>
                        )}
                        <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        {!selectedShow && listOfShows.map((show, index) => (
                                    <Show key={index}
                                          name={show.name}
                                          date={new Date(show.date).toLocaleDateString()}
                                          time={new Date(show.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                          venue={selectedVenue.name}
                                          id={show.id}
                                          active={show.active}
                                          onClick={() => handleShowClick(index)} />
                                    ))}
                          {/* {!selectedShow && listOfShows.map((event, index) => (
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
                          ))} */}
                          {selectedShow && !showCreating && (
                            <div>
                              <div>
                                <Show
                                  name={selectedShow.name}
                                  date={new Date(selectedShow.date).toLocaleDateString()}
                                  time={new Date(selectedShow.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                  venue={selectedVenue.name}
                                  active={selectedShow.active}
                                  id={selectedShow.id}
                                />
                                <button onClick={handleUnselectShow}>unselectShow</button>
                                <button onClick={activateShow}>activateShow</button>
                                <button onClick={handleDeleteShow}>deleteShow</button>
                              </div>

                              <div style={{ position: 'absolute', right: 100, top:100 }}>
                              <h3>Venue Layout</h3>
                              <input type="number" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} placeholder="Enter ticket price"/><p></p>
                              <p>This ticket price will be assigned to all seats: ${ticketPrice}</p>
                              <button onClick={createBlock}>Submit ticket price</button>
                              <div style={{ display: 'flex' }}>
                              <Section title="Left" rows={getLayout(selectedVenue.id, 0)} cols={getLayout(selectedVenue.id, 1)} canSelect={false}/>
                              <Section title="Center" rows={getLayout(selectedVenue.id, 2)} cols={getLayout(selectedVenue.id, 3)}  canSelect={false}/>
                              <Section title="Right" rows={getLayout(selectedVenue.id, 4)} cols={getLayout(selectedVenue.id, 5)}  canSelect={false}/>
                              </div>
                            </div>
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
      {selectedVenue && showCreating && (
      <div>
        <div style={{ position: 'absolute', left: 100, top: 50 }}>
          {/* Form for creating a show */}
          <input type="text" value={showName} onChange={(e) => setShowName(e.target.value)} placeholder="Show Name" /> <p></p>
          <input type="datetime-local" value={formatDateTime(showDate, showTime)} onChange={(e) => handleDateTimeChange(e.target.value)} placeholder="Show Date and Time" />
          <p>Confirm the information: </p>
          <p>Show Name: {showName}</p>
          <p>{displayDate(showDate)}</p>
          <p>{displayTime(showTime)}</p>
          <div>
            <button onClick={handleBackCreateShow()}>← </button>
            <button onClick={createShow}>Submit</button>
            {submitLoading && <p>Please wait, this might take some seconds...</p>}
          </div>
        </div>
        <div style={{ position: 'absolute', right: 100, top: 100 }}>
          <h3>Venue Layout</h3>
          <div style={{ display: 'flex' }}>
            {/* Venue layout sections */}
            {/* <Section title="Left" rows={leftRow} cols={leftCol} canSelect={false} />
            <Section title="Center" rows={centerRow} cols={centerCol} canSelect={false} />
            <Section title="Right" rows={rightRow} cols={rightCol} canSelect={false} /> */}
          </div>
        </div>
      </div>
    )}
    </div>
  );
};
export default AdminHome;
