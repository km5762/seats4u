import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createVenueC, deleteVenueC, createShowC, deleteShowC, activateShowC } from '../controller/Controller';
import BlockCanvas from '../boundary/Boundary';
import { VenueManager } from '../model/Model';

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
  const Show = ({ name, date, time, onClick, id, active }) => (
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
      <p><strong>Status:</strong> {active}</p>
      {/* <p><strong>Date:</strong> {date.split("T")[0]}</p>
      <p><strong>Time:</strong> {date.split("T")[1].split("Z")[0]}</p> */}
      <p><strong>Id:</strong> {id}</p>
    </div>
  );

const ManagerHome = ({ loggedInUser, onLogout }) => {
  
    const [manager, setManager] = React.useState(new VenueManager());

    const location = useLocation();
    const receivedData = location.state.userData;
   
    const [loading, setLoading] = useState(false);

    // venues
    const [venueCreated, setVenueCreated] = useState(false);
    const [venueName, setVenueName] = useState('');
    const [leftRow, setLeftRow] = useState('');
    const [leftCol, setLeftCol] = useState('');
    const [rightRow, setRightRow] = useState('');
    const [rightCol, setRightCol] = useState('');
    const [centerRow, setCenterRow] = useState('');
    const [centerCol, setCenterCol] = useState('');
    const [showCreating, setShowCreating] = useState(false);
    const [generatedToggle, setGeneratedToggle] = useState(false);
    const [showName, setShowName] = useState('');
    const [showDate, setShowDate] = useState('');
    const [showTime, setShowTime] = useState('');
    const [showNum, setShowNum] = useState(0);
    const [initialShowCount, setInitialShowCount] = useState(0);
    const [submitLoading, setSubmitLoading] = useState(false);

    React.useEffect(() => {
        if (receivedData && Array.isArray(receivedData.venue) && receivedData.venue.length > 0) {
          const firstVenue = receivedData.venue[0];
          manager.createVenue(firstVenue.name);
          manager.addId(firstVenue.id);
          setVenueName(firstVenue.name);
          setVenueCreated(true);
        }

        listShows();
      
        // if (receivedData && receivedData.events && receivedData.events.length > 0) {
        //   const events = receivedData.events;
    
        //   // Filter unique events by ID
        //   const uniqueEvents = [...new Map(events.map(event => [event.id, event])).values()];
    
        //   const showsFromEvents = uniqueEvents
        //     .filter(event => event.date) // Filter out events without a date
        //     .map((event) => {
        //       const { id, name, date, active } = event;
        //       const utcDate = new Date(date);
      
        //       const localDate = utcDate.toLocaleDateString();
        //       const localTime = utcDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      
        //       return {
        //         id,
        //         name,
        //         date: localDate,
        //         time: localTime,
        //         active,
        //       };
        //     });
      
        //   setShows(showsFromEvents);
        //   if (initialShowCount === 0) {
        //     setInitialShowCount(uniqueEvents.length);
        //     setShowNum(uniqueEvents.length);
        // }
        // }
    }, [receivedData]);
    
  
  
    const createVenue = () => {
      setVenueCreated(true);
      createVenueC(manager, venueName, leftRow, leftCol, rightRow, rightCol, centerRow, centerCol);
    };

    const deleteVenue = () => {
        deleteVenueC(manager);
        setVenueCreated(false);
        setVenueName('');
        setLeftRow('');
        setLeftCol('');
        setRightRow('');
        setRightCol('');
        setCenterRow('');
        setCenterCol('');
        setShowCreating(false);
        setShowNum(0);
        console.log(manager.venue);
        onLogout(); 
  };
  
    const handleLeftRowChange = (e) => {
      const value = parseInt(e.target.value, 10);
      if (value >= 0 && value <= 26) {
        setLeftRow(value);
      }
    };
  
    const handleLeftColChange = (e) => {
      const value = parseInt(e.target.value, 10);
      if (value >= 0) {
        setLeftCol(value);
      }
    };
  
    const handleCenterRowChange = (e) => {
      const value = parseInt(e.target.value, 10);
      if (value >= 0 && value <= 26) {
        setCenterRow(value);
      }
    };
  
    const handleCenterColChange = (e) => {
      const value = parseInt(e.target.value, 10);
      if (value >= 0) {
        setCenterCol(value);
      }
    };
  
    const handleRightRowChange = (e) => {
      const value = parseInt(e.target.value, 10);
      if (value >= 0 && value <= 26) {
        setRightRow(value);
      }
    };
  
    const handleRightColChange = (e) => {
      const value = parseInt(e.target.value, 10);
      if (value >= 0) {
        setRightCol(value);
      }
    };
  
    // shows
    const [shows, setShows] = useState([]);
    const [selectedShow, setSelectedShow] = useState(null);
  
    const addShow = (newShow) => {
      setShows((prevShows) => [...prevShows, newShow]);
    };
  
    
    const handleShowClick = (index) => {
      setSelectedShow(shows[index]);
    };
  
    const handleUnselectShow = () => {
      setGeneratedToggle(false)
      setSelectedShow(null);
    };
  
    const handleDeleteShow = () => {
      console.log(selectedShow.id)
      deleteShowC(manager, selectedShow);
      setShows(prevShows => prevShows.filter(show => show !== selectedShow));
      setSelectedShow(null);
      setShowNum(prevNum => prevNum - 1);
    };
  
    const creatingShow = () => {
      setShowCreating(true);
    }


    const activateShow = () => {
      selectedShow.active = 1;
      activateShowC(selectedShow);
      console.log(selectedShow);
    };

    const generateShowReport = () => {
      setGeneratedToggle(!generatedToggle);
    }
  
    const createShow = () => {
        setSubmitLoading(true);
        const year = Math.floor(showDate / 10000);
        const month = Math.floor((showDate % 10000) / 100);
        const day = showDate % 100;
        const hours = Math.floor(showTime / 100);
        const minutes = showTime % 100;
        
        // Call createShowC with await if it returns a Promise
        createShowC(manager, showName, showDate, showTime).then((id) => {
    
            // Set manager.showId after the asynchronous operation completes
            manager.showId = id;
        
            // Use setTimeout to introduce a delay
            setTimeout(() => {
        
            // Access manager.showId after the delay
            addShow({
                name: showName,
                date: `${year}-${month}-${day}`,
                time: `${hours}:${minutes}`,
                id: manager.showId,
                active: 0,
            });
        
            setShowName('');
            setShowDate('');
            setShowTime('');
            setShowNum((prevNum) => prevNum + 1);
            setShowCreating(false);
            setSubmitLoading(false);
            console.log(manager.showId);
            }, 2000);

      });
    };


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
  
    // Function to retrieve numbers from the dictionary
    const getLayout = (venueId, num) => {
      let layout = layoutDict[venueId]
      console.log(layoutDict[venueId])
      let result = layout[num]
      return result;
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

      // setShows(data.events);
      setShows([]);
      data.events.map(event => {
        // Call addShow for each event
        event.venue_id === manager.id && addShow({
          name: event.name,
          date: new Date(event.date).toLocaleDateString(),
          time: new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          id: event.id,
          active: event.active,
        });});

      data.sections.map(section => {
        // Call addShow for each event
        section.venue_id === manager.id && updateDict(section.venue_id, [section.row_count, section.col_count]);
      });
      
    }

    const [ticketPrice, setTicketPrice] = useState(null);

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
                    "startRow": null,
                    "endRow": null
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
    const handleBackCreateShow = () => {
      setShowName('');
      setShowDate('');
      setShowTime('');
      setShowCreating(false);
      setSubmitLoading(false);
}
  
    return (
        <div>
            <div className="center-container">
                <img src='/pictures/logo.png' alt="Logo" width="250" height="100" />
            </div>

            <div className="upper-right-text">
                {loggedInUser ? (
                    <div>
                        <p>Welcome back, {loggedInUser.role} {loggedInUser.username}! Now you may manage.</p>
                        <button onClick={onLogout}>Logout</button>
                        {/* <Link to="/">Customer View</Link> */}
                    </div>
                ) : (
                    <div>
                        <p>Logged out</p>
                        <Link to="/">Go back to home page</Link>
                        <p>Or <Link to="/login">log in</Link> again here</p>
                    </div>
                )}
            </div>
            
            {loggedInUser && (
            <div>
                {!venueCreated ? (
                    <div>
                        <div style={{ position: 'absolute', left: 100, top:100 }}>
                            <input type="text" value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="Venue Name"/> <p></p>
                            <input type="number" value={leftRow} onChange={handleLeftRowChange} placeholder="left row number"/><p></p>
                            <input type="number" value={leftCol} onChange={handleLeftColChange} placeholder="left col number"/><p></p>
                            <input type="number" value={centerRow} onChange={handleCenterRowChange} placeholder="center row number"/><p></p>
                            <input type="number" value={centerCol} onChange={handleCenterColChange} placeholder="center col number"/><p></p>
                            <input type="number" value={rightRow} onChange={handleRightRowChange} placeholder="right row number"/><p></p>
                            <input type="number" value={rightCol} onChange={handleRightColChange} placeholder="right col number"/><p></p>
                            <p>Confirm the information: </p>
                            <p>Venue Name: {venueName}</p> <p>Left Row: {leftRow}</p> <p>Left Col: {leftCol}</p> <p>Center Row: {centerRow}</p> 
                            <p>Center Col: {centerCol}</p> <p>Right Row: {rightRow}</p> <p>Right Col: {rightCol}</p> 
                            <button onClick={createVenue}>Submit</button>
                        </div>
                        <div style={{ position: 'absolute', right: 100, top:100 }}>
                            <h3>Venue Layout</h3>
                            <div style={{ display: 'flex' }}>
                            <Section title="Left" rows={leftRow} cols={leftCol} canSelect={false}/>
                            <Section title="Center" rows={centerRow} cols={centerCol} canSelect={false}/>
                            <Section title="Right" rows={rightRow} cols={rightCol} canSelect={false}/>
                            </div>
                        </div>
                    </div>
                ):(
                <div>
                    
                    <div>
                    {!showCreating ? (
                        <div>
                            <div>
                                {!selectedShow && (
                                    <div style={{ position: 'absolute', left: 100, top:50 }}>
                                    <h3>Your Venue: {venueName}</h3>
                                    <h3>Your list of shows</h3>
                                    <p>You have {shows.length} shows</p>
                                    <button onClick={creatingShow}>Create show</button>
                                    <button onClick={deleteVenue}>Delete Venue</button>
                                    <button onClick={listShows}>Refresh</button>
                                    </div>)
                                }
                                <div style={{ position: 'absolute', left: 100, top:250, display: 'flex', flexWrap: 'wrap' }}>
                                    {!selectedShow && shows.map((show, index) => (
                                    <Show key={index} {...show} onClick={() => handleShowClick(index)} />
                                    ))}
                                </div>
                                {selectedShow && (
                                    <div>
                                        <div style={{ position: 'absolute', left: 100, top:50 }}>
                                            <h2>Selected Show</h2>
                                            <p><strong>Show:</strong> {selectedShow.name}</p>
                                            <p><strong>Date:</strong> {selectedShow.date}</p>
                                            <p><strong>Time:</strong> {selectedShow.time}</p>
                                            <p><strong>Id:</strong> {selectedShow.id}</p>
                                            <button onClick={handleUnselectShow}>unselectShow</button>
                                            <button onClick={activateShow}>activateShow</button>
                                            <button onClick={generateShowReport}>generateShowReport</button>
                                            <button onClick={handleDeleteShow}>deleteShow</button>
                                        </div>
                                        {generatedToggle && (
                                          <div style={{ position: 'absolute', left: 100, top:300 }}>
                                            <p><strong>Active:</strong> {selectedShow.name}</p>
                                            <p><strong>Tickets Sold:</strong> {selectedShow.name}</p>
                                            <p><strong>Tickets Remainig:</strong> {selectedShow.name}</p>
                                            <p><strong>Revenue:</strong> {selectedShow.name}</p>
                                          </div>
                                        )}
                                        <div style={{ position: 'absolute', right: 100, top:100 }}>
                                            <h3>Venue Layout</h3>
                                            <input type="number" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} placeholder="Enter ticket price"/><p></p>
                                            <p>This ticket price will be assigned to all seats: ${ticketPrice}</p>
                                            <button onClick={createBlock}>Submit ticket price</button>
                                            <div style={{ display: 'flex' }}>
                                            <Section title="Left" rows={getLayout(manager.id, 0)} cols={getLayout(manager.id, 1)} canSelect={false}/>
                                            <Section title="Center" rows={getLayout(manager.id, 2)} cols={getLayout(manager.id, 3)}  canSelect={false}/>
                                            <Section title="Right" rows={getLayout(manager.id, 4)} cols={getLayout(manager.id, 5)}  canSelect={false}/>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div style={{ position: 'absolute', left: 100, top:50 }}>
                                <input type="text" value={showName} onChange={(e) => setShowName(e.target.value)} placeholder="Show Name"/> <p></p>
                                <input type="datetime-local" value={formatDateTime(showDate, showTime)} onChange={(e) => handleDateTimeChange(e.target.value)} placeholder="Show Date and Time"/>
                                <p>Confirm the information: </p>
                                <p>Show Name: {showName}</p> 
                                <p>{displayDate(showDate)}</p>
                                <p>{displayTime(showTime)}</p>
                                <div>
                                  <button onClick={handleBackCreateShow}>← </button>
                                  <button onClick={createShow}>Submit</button>
                                  {submitLoading && <p>Please wait, this might take some seconds...</p>}
                                </div>
                            </div>
                            <div style={{ position: 'absolute', right: 100, top:100 }}>
                                <h3>Venue Layout</h3>
                                <div style={{ display: 'flex' }}>
                                <Section title="Left" rows={leftRow} cols={leftCol} canSelect={false}/>
                                <Section title="Center" rows={centerRow} cols={centerCol} canSelect={false}/>
                                <Section title="Right" rows={rightRow} cols={rightCol} canSelect={false}/>
                                </div>
                            </div>
                        </div>
                    )}
                    </div> 
                </div>
                )}
            </div>
            )}
            
        </div>
    )
  };
  
  export default ManagerHome;
  