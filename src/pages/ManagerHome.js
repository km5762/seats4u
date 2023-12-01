import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createVenueC, deleteVenueC, createShowC } from '../controller/Controller';
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
  
    const handleSeatClick = (row, col) => {
      if (canSelect) {
        // Check if the seat is already selected
        const isSeatSelected = selectedSeats.some(seat => seat.row === row && seat.col === col);
  
        if (!isSeatSelected) {
          // Add the selected seat to the list
          setSelectedSeats(prevSeats => [...prevSeats, { row, col }]);
        } else {
          // Remove the selected seat from the list if it's already selected
          setSelectedSeats(prevSeats => prevSeats.filter(seat => !(seat.row === row && seat.col === col)));
        }
      }
    };
  
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
                onClick={() => handleSeatClick(rowIndex + 1, colIndex + 1)}
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
  const Show = ({ name, date, time, onClick }) => (
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
    </div>
  );

// const ManagerHome = ({ loggedInUser, onLogout }) => {

//     const [manager, setManager] = React.useState(new VenueManager());
    
//     const [venueCreating, setVenueCreating] = useState(false);
//     const [venueCreated, setVenueCreated] = useState(false);

//     const [showCreating, setShowCreating] = useState(false);
//     const [showCreated, setShowCreated] = useState(false);

//     const [venueName, setVenueName] = useState('');
//     const [leftRow, setLeftRow] = useState('');
//     const [leftCol, setLeftCol] = useState('');
//     const [rightRow, setRightRow] = useState('');
//     const [rightCol, setRightCol] = useState('');
//     const [centerRow, setCenterRow] = useState('');
//     const [centerCol, setCenterCol] = useState('');

//     const [showName, setShowName] = useState('');
//     const [showDate, setShowDate] = useState('');
//     const [showTime, setShowTime] = useState('');
//     const [showNum, setShowNum] = useState(0);


//     const [venueId, setVenueId] = useState(0);

//     const location = useLocation();
//     const receivedData = location.state.userData;
   

//     React.useEffect(() => {
//         if (receivedData && Array.isArray(receivedData.venue) && receivedData.venue.length > 0) {
//             const firstVenue = receivedData.venue[0];
//             manager.createVenue(firstVenue.name);
//             manager.addId(firstVenue.id);
//             // setVenueId(firstVenue.id);
//             setVenueName(firstVenue.name); 
//             setVenueCreated(true);
//         }
//     }, [receivedData]);



//     const creatingVenue = () => {
//         setVenueCreating(true);
//         console.log("venueCreating ", venueCreating);
//         console.log("venueCreated ", venueCreated);
//     };

//     const createVenue = () => {
//         createVenueC(manager, venueName, leftRow, leftCol, rightRow, rightCol, centerRow, centerCol);
//         setVenueCreated(true);
//         console.log(manager)
//         console.log(manager.venue);
//     };

//     const deleteVenue = () => {
//         deleteVenueC(manager);
//         setVenueCreating(false);
//         setVenueCreated(false);
//         setVenueName('');
//         setLeftRow('');
//         setLeftCol('');
//         setRightRow('');
//         setRightCol('');
//         setCenterRow('');
//         setCenterCol('');
//         setShowCreating(false);
//         setShowCreated(false);
//         setShowNum(0);
//         console.log(manager.venue);
//         onLogout(); 
//     };

//     const creatingShow = () => {
//         setShowCreating(true);
//     }

//     const createShow = () => {
//         console.log(manager.venue)
//         createShowC(manager,showName, showDate, showTime);
//         console.log(manager.venue);
//         setShowName('');
//         setShowDate('');
//         setShowTime('');
//         setShowNum(prevNum => prevNum + 1);
//         setShowCreating(false);
//         setShowCreated(true);
//     }

//     const formatDateTime = (date, time) => {
//         const year = Math.floor(date / 10000);
//         const month = Math.floor((date % 10000) / 100);
//         const day = date % 100;
    
//         const hours = Math.floor(time / 100);
//         const minutes = time % 100;
    
//         return `${year.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
//     };
    
//     const handleDateTimeChange = (datetimeString) => {
//         const selectedDate = new Date(datetimeString); // Convert string to Date object
//         if (!isNaN(selectedDate)) {
//             // Check if the conversion was successful
//             const year = selectedDate.getFullYear(); // Extract YYYY
//             const month = selectedDate.getMonth() + 1; // GetMonth is zero-based
//             const day = selectedDate.getDate();
    
//             const hours = selectedDate.getHours();
//             const minutes = selectedDate.getMinutes();
    
//             // Convert date and time to your desired format and update state variables
//             setShowDate(year * 10000 + month * 100 + day);
//             setShowTime(hours * 100 + minutes);
//         }
//     };
    

//     const displayDate = (date) => {
//         const year = Math.floor(date / 10000);
//         const month = Math.floor((date % 10000) / 100);
//         const day = date % 100;
//         return `Date: Month ${month.toString().padStart(2, '0')} / Day ${day.toString().padStart(2, '0')} / Year ${year}`;
//     };
    
//     const displayTime = (time) => {
//         const hour = Math.floor(time / 100);
//         const minute = time % 100;
//         return `Time: ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
//     };
    

//   return (
//     <div>

//         <div className="center-container">
//           <img src='/pictures/logo.png' alt="Logo" width="250" height="100" />
//         </div>

//         <div className="upper-right-text">
//             {loggedInUser ? (
//                 <div>
//                     <p>Welcome back, {loggedInUser.role} {loggedInUser.username}! Now you may manage.</p>
//                     <button onClick={onLogout}>Logout</button>
//                     {/* <Link to="/">Customer View</Link> */}
//                 </div>
//             ) : (
//                 <div>
//                     <p>Logged out</p>
//                     <Link to="/">Go back to home page</Link>
//                     <p>Or <Link to="/login">log in</Link> again here</p>
//                 </div>
//             )}
//         </div>

//         {loggedInUser ? (
//             <div>
//                 {!venueCreating && !venueCreated ? (
//                     <div className="center-container">
//                         <p>No Venue Yet</p>
//                         <p>Please Create a Venue</p>
//                         <button onClick={creatingVenue}>Create a Venue</button>
//                     </div>
//                 ) : (
//                     <div>
//                         {!venueCreated && venueCreating ? (
//                             <div>
//                                 <div className="left-container">
//                                     <input type="text" value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="Venue Name"/> <p></p>
//                                     <input type="number" value={leftRow} onChange={(e) => setLeftRow(parseInt(e.target.value, 10))} placeholder="left row number"/><p></p>
//                                     <input type="number" value={leftCol} onChange={(e) => setLeftCol(parseInt(e.target.value, 10))} placeholder="left col number"/><p></p>
//                                     <input type="number" value={rightRow} onChange={(e) => setRightRow(parseInt(e.target.value, 10))} placeholder="right row number"/><p></p>
//                                     <input type="number" value={rightCol} onChange={(e) => setRightCol(parseInt(e.target.value, 10))} placeholder="right col number"/><p></p>
//                                     <input type="number" value={centerRow} onChange={(e) => setCenterRow(parseInt(e.target.value, 10))} placeholder="center row number"/><p></p>
//                                     <input type="number" value={centerCol} onChange={(e) => setCenterCol(parseInt(e.target.value, 10))} placeholder="center col number"/><p></p>
//                                     <p>Confirm the information: </p>
//                                     <p>Venue Name: {venueName}</p> <p>Left Row: {leftRow}</p> <p>Left Col: {leftCol}</p> 
//                                     <p>Right Row: {rightRow}</p> <p>Right Col: {rightCol}</p> <p>Center Row: {centerRow}</p> <p>Center Col: {centerCol}</p>
//                                     <button onClick={createVenue}>Submit</button>
//                                 </div>
//                                 <div className="lSection">
//                                     <BlockCanvas col={leftCol} row={leftRow} width={20} height={20} text={"left"} style={{ marginRight: '20px' }}/>
//                                 </div>
//                                 <div className="cSection">
//                                     <BlockCanvas col={centerCol} row={centerRow} width={20} height={20} text={"right"} style={{ marginRight: '20px' }}/>
//                                 </div>
//                                 <div className="rSection">
//                                     <BlockCanvas col={rightCol} row={rightRow} width={20} height={20} text={"center"} style={{ marginRight: '20px' }}/>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="center-container">
//                                 <p>Your Venue: {venueName}</p>
//                                 <button onClick={creatingShow}>Create Show</button>
//                                 <button onClick={deleteVenue}>Delete Venue</button>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         ) : (
//             <p></p>
//         )}

//         {loggedInUser && showCreating ? (
//             <div className="left-container">
//                 <input type="text" value={showName} onChange={(e) => setShowName(e.target.value)} placeholder="Show Name"/> <p></p>
//                 {/* <input type="number" value={showDate} onChange={(e) => setShowDate(parseInt(e.target.value, 10))} placeholder="Show Date in MMDDYY Format"/><p></p> */}
//                 <input type="datetime-local" value={formatDateTime(showDate, showTime)} onChange={(e) => handleDateTimeChange(e.target.value)} placeholder="Show Date and Time"/>
//                 {/* <input type="datetime-local" value={showDate} onChange={(e) => setShowDate(parseInt(e.target.value, 10))} placeholder="Show Date in MMDDYY Format"/> */}
//                 {/* <input type="number" value={showTime} onChange={(e) => setShowTime(parseInt(e.target.value, 10))} placeholder="Show Time in HHMM Format"/><p></p> */}
//                 <p>Confirm the information: </p>
//                 <p>Show Name: {showName}</p> 
//                 <p>{displayDate(showDate)} {displayTime(showTime)}</p>
//                 <button onClick={createShow}>Submit</button>
//                 <button>Add block</button>
//                 <button>Delete block</button>

//                 <div className="lSection">
//                     <BlockCanvas col={leftCol} row={leftRow} width={20} height={20} text={"left"} style={{ marginRight: '20px' }}/>
//                 </div>
//                 <div className="cSection">
//                     <BlockCanvas col={centerCol} row={centerRow} width={20} height={20} text={"center"} style={{ marginRight: '20px' }}/>
//                 </div>
//                 <div className="rSection">
//                     <BlockCanvas col={rightCol} row={rightRow} width={20} height={20} text={"right"} style={{ marginRight: '20px' }}/>
//                 </div>
//             </div>
//         ) : (
//             <div>
//             {showCreated ? (
//                 <div className='middle-container'>
//                     <p>You have {showNum} shows.</p>
//                     {manager.venue.shows.map((show, index) => (
//                     <div key={index}>
//                         <p>Show Name: {show.name}</p>
//                         <p>{displayDate(show.date)} {displayTime(show.time)}</p>
//                     </div>
//                     ))}
//                 </div>
//             ) :(
//                 <div></div>
//             )}
//             </div>
//         )}

//         {/* <div className="lower-right-text">
//             {loggedInUser && loggedInUser.role === "Administrator" ? (
//                 <div>
//                     <p>Now you are in Manager view.</p>
//                     <Link to="/admin">Go back to Admin View</Link>
//                 </div>
//             ) : (
//                 <p></p>
//             )}
//         </div> */}

//     </div>
//   );
// };

// export default ManagerHome;


// App component combining sections
const ManagerHome = ({ loggedInUser, onLogout }) => {
  
    const [manager, setManager] = React.useState(new VenueManager());

    const location = useLocation();
    const receivedData = location.state.userData;
   

    React.useEffect(() => {
        if (receivedData && Array.isArray(receivedData.venue) && receivedData.venue.length > 0) {
            const firstVenue = receivedData.venue[0];
            manager.createVenue(firstVenue.name);
            manager.addId(firstVenue.id);
            // setVenueId(firstVenue.id);
            setVenueName(firstVenue.name); 
            setVenueCreated(true);
        }
    }, [receivedData]);

    // venues
    const [venueCreated, setVenueCreated] = useState(false);
    const [venueName, setVenueName] = useState('');
    const [leftRow, setLeftRow] = useState('');
    const [leftCol, setLeftCol] = useState('');
    const [rightRow, setRightRow] = useState('');
    const [rightCol, setRightCol] = useState('');
    const [centerRow, setCenterRow] = useState('');
    const [centerCol, setCenterCol] = useState('');
  
    const createVenue = () => {
      setVenueCreated(true);
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
  
    const [showCreating, setShowCreating] = useState(false);
  
    const [showName, setShowName] = useState('');
    const [showDate, setShowDate] = useState('');
    const [showTime, setShowTime] = useState('');
    const [showNum, setShowNum] = useState(0);
  
    const handleShowClick = (index) => {
      setSelectedShow(shows[index]);
    };
  
    const handleUnselectShow = () => {
      setSelectedShow(null);
    };
  
    const handleDeleteShow = () => {
      setShows(prevShows => prevShows.filter(show => show !== selectedShow));
      setSelectedShow(null);
      setShowNum(prevNum => prevNum - 1);
    };
  
    const creatingShow = () => {
      setShowCreating(true);
    }
  
    const createShow = () => {
      const month = parseInt(showDate / 10000, 10);
      const day = parseInt((showDate - month * 10000) / 100, 10);
      const year = showDate - month * 10000 - day * 100 + 2000;
      const hour = parseInt(showTime / 100, 10);
      const minute = showTime - hour * 100
      addShow({ name: showName, date: `${year}-${month}-${day}`, time: `${hour}:${minute}` });
      setShowName('');
      setShowDate('');
      setShowTime('');
      setShowNum(prevNum => prevNum + 1);
      setShowCreating(false);
    }
  
    const displayDate = (date) => {
      const month = parseInt(date / 10000, 10);
      const day = parseInt((date - month * 10000) / 100, 10);
      const year = date - month * 10000 - day * 100 + 2000;
  
      return <p>Date: Month {month} / Day {day} / Year {year}</p>
    }
  
    const displayTime = (time) => {
      const hour = parseInt(time / 100, 10);
      const minute = time - hour * 100
  
      return <p>Time: {hour} : {minute}</p>
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
                                    <h3>Your list of shows</h3>
                                    <p>You have {showNum} shows</p>
                                    <button onClick={creatingShow}>Create show</button>
                                    </div>)
                                }
                                <div style={{ position: 'absolute', left: 100, top:200 }}>
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
                                            <button onClick={handleUnselectShow}>unselectShow</button>
                                            <button onClick={handleDeleteShow}>deleteShow</button>
                                        </div>
                                        <div style={{ position: 'absolute', right: 100, top:100 }}>
                                            <h3>Venue Layout</h3>
                                            <div style={{ display: 'flex' }}>
                                            <Section title="Left" rows={leftRow} cols={leftCol} canSelect={true}/>
                                            <Section title="Center" rows={centerRow} cols={centerCol} canSelect={true}/>
                                            <Section title="Right" rows={rightRow} cols={rightCol} canSelect={true}/>
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
                                <input type="number" value={showDate} onChange={(e) => setShowDate(parseInt(e.target.value, 10))} placeholder="Show Date in MMDDYY Format"/><p></p>
                                <input type="number" value={showTime} onChange={(e) => setShowTime(parseInt(e.target.value, 10))} placeholder="Show Time in HHMM Format"/><p></p>
                                <p>Confirm the information: </p>
                                <p>Show Name: {showName}</p> {displayDate(showDate)} {displayTime(showTime)}
                                <button onClick={createShow}>Submit</button>
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
  