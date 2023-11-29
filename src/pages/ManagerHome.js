import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createVenueC, deleteVenueC, createShowC } from '../controller/Controller';
import BlockCanvas from '../boundary/Boundary';
import { VenueManager } from '../model/Model';

const ManagerHome = ({ loggedInUser, onLogout }) => {

    const [manager, setManager] = React.useState(new VenueManager());
    

    
    const [venueCreating, setVenueCreating] = useState(false);
    const [venueCreated, setVenueCreated] = useState(false);

    const [showCreating, setShowCreating] = useState(false);
    const [showCreated, setShowCreated] = useState(false);

    const [venueName, setVenueName] = useState('');
    const [leftRow, setLeftRow] = useState('');
    const [leftCol, setLeftCol] = useState('');
    const [rightRow, setRightRow] = useState('');
    const [rightCol, setRightCol] = useState('');
    const [centerRow, setCenterRow] = useState('');
    const [centerCol, setCenterCol] = useState('');

    const [showName, setShowName] = useState('');
    const [showDate, setShowDate] = useState('');
    const [showTime, setShowTime] = useState('');
    const [showNum, setShowNum] = useState(0);


    // const [venueId, setVenueId] = useState(0);

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



    // React.useEffect(() => {
    //     if (receivedData && Array.isArray(receivedData.venue) && receivedData.venue.length > 0) {
    //         const firstVenue = receivedData.venue[0];
    //         manager.createVenue(firstVenue.name);
    //         setVenueName(firstVenue.name); 
    //         setVenueCreated(true);
    //     }
    // }, [receivedData]);

    const creatingVenue = () => {
        setVenueCreating(true);
        console.log("venueCreating ", venueCreating);
        console.log("venueCreated ", venueCreated);
    };

    const createVenue = () => {
        createVenueC(manager, venueName, leftRow, leftCol, rightRow, rightCol, centerRow, centerCol);
        setVenueCreated(true);
        console.log(manager)
        console.log(manager.venue);
    };

    const deleteVenue = () => {
        deleteVenueC(manager);
        setVenueCreating(false);
        setVenueCreated(false);
        setVenueName('');
        setLeftRow('');
        setLeftCol('');
        setRightRow('');
        setRightCol('');
        setCenterRow('');
        setCenterCol('');
        setShowCreating(false);
        setShowCreated(false);
        setShowNum(0);
        console.log(manager.venue);
        onLogout(); 
    };

    const creatingShow = () => {
        setShowCreating(true);
    }

    const createShow = () => {
        console.log(manager.venue)
        createShowC(manager,showName, showDate, showTime);
        console.log(manager.venue);
        setShowName('');
        setShowDate('');
        setShowTime('');
        setShowNum(prevNum => prevNum + 1);
        setShowCreating(false);
        setShowCreated(true);
    }

    const displayDate = (date) => {
        const month = parseInt(date / 10000, 10);
        const day = parseInt((date - month * 10000) / 100, 10);
        const year = date - month * 10000 - day * 100 + 2000;

        return <p>Date: {month} / {day} / {year}</p>
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
                    <Link to="/">Customer View</Link>
                </div>
            ) : (
                <div>
                    <p>Logged out</p>
                    <Link to="/">Go back to home page</Link>
                    <p>Or <Link to="/login">log in</Link> again here</p>
                </div>
            )}
        </div>

        {loggedInUser ? (
            <div>
                {!venueCreating && !venueCreated ? (
                    <div className="center-container">
                        <p>No Venue Yet</p>
                        <p>Please Create a Venue</p>
                        <button onClick={creatingVenue}>Create a Venue</button>
                    </div>
                ) : (
                    <div>
                        {!venueCreated && venueCreating ? (
                            <div>
                                <div className="left-container">
                                    <input type="text" value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="Venue Name"/> <p></p>
                                    <input type="number" value={leftRow} onChange={(e) => setLeftRow(parseInt(e.target.value, 10))} placeholder="left row number"/><p></p>
                                    <input type="number" value={leftCol} onChange={(e) => setLeftCol(parseInt(e.target.value, 10))} placeholder="left col number"/><p></p>
                                    <input type="number" value={rightRow} onChange={(e) => setRightRow(parseInt(e.target.value, 10))} placeholder="right row number"/><p></p>
                                    <input type="number" value={rightCol} onChange={(e) => setRightCol(parseInt(e.target.value, 10))} placeholder="right col number"/><p></p>
                                    <input type="number" value={centerRow} onChange={(e) => setCenterRow(parseInt(e.target.value, 10))} placeholder="center row number"/><p></p>
                                    <input type="number" value={centerCol} onChange={(e) => setCenterCol(parseInt(e.target.value, 10))} placeholder="center col number"/><p></p>
                                    <p>Confirm the information: </p>
                                    <p>Venue Name: {venueName}</p> <p>Left Row: {leftRow}</p> <p>Left Col: {leftCol}</p> 
                                    <p>Right Row: {rightRow}</p> <p>Right Col: {rightCol}</p> <p>Center Row: {centerRow}</p> <p>Center Col: {centerCol}</p>
                                    <button onClick={createVenue}>Submit</button>
                                </div>
                                <div className="lSection">
                                    <BlockCanvas col={leftCol} row={leftRow} width={20} height={20} text={"left"} style={{ marginRight: '20px' }}/>
                                </div>
                                <div className="cSection">
                                    <BlockCanvas col={centerCol} row={centerRow} width={20} height={20} text={"right"} style={{ marginRight: '20px' }}/>
                                </div>
                                <div className="rSection">
                                    <BlockCanvas col={rightCol} row={rightRow} width={20} height={20} text={"center"} style={{ marginRight: '20px' }}/>
                                </div>
                            </div>
                        ) : (
                            <div className="center-container">
                                <p>Your Venue: {venueName}</p>
                                <button onClick={creatingShow}>Create Show</button>
                                <button onClick={deleteVenue}>Delete Venue</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        ) : (
            <p></p>
        )}

        {loggedInUser && showCreating ? (
            <div className="left-container">
                <input type="text" value={showName} onChange={(e) => setShowName(e.target.value)} placeholder="Show Name"/> <p></p>
                <input type="number" value={showDate} onChange={(e) => setShowDate(parseInt(e.target.value, 10))} placeholder="Show Date in MMDDYY Format"/><p></p>
                <input type="number" value={showTime} onChange={(e) => setShowTime(parseInt(e.target.value, 10))} placeholder="Show Time in HHMM Format"/><p></p>
                <p>Confirm the information: </p>
                <p>Show Name: {showName}</p> <p>Show Date: {showDate}</p> <p>Show Time: {showTime}</p> 
                <button onClick={createShow}>Submit</button>
                <button>Add block</button>
                <button>Delete block</button>

                <div className="lSection">
                    <BlockCanvas col={leftCol} row={leftRow} width={20} height={20} text={"left"} style={{ marginRight: '20px' }}/>
                </div>
                <div className="cSection">
                    <BlockCanvas col={centerCol} row={centerRow} width={20} height={20} text={"center"} style={{ marginRight: '20px' }}/>
                </div>
                <div className="rSection">
                    <BlockCanvas col={rightCol} row={rightRow} width={20} height={20} text={"right"} style={{ marginRight: '20px' }}/>
                </div>
            </div>
        ) : (
            <div>
            {showCreated ? (
                <div className='middle-container'>
                    <p>You have {showNum} shows.</p>
                    {manager.venue.shows.map((show, index) => (
                    <div key={index}>
                        <p>Show Name: {show.name}</p>
                        {displayDate(show.date)}
                        {displayTime(show.time)}
                    </div>
                    ))}
                </div>
            ) :(
                <div></div>
            )}
            </div>
        )}

        <div className="lower-right-text">
            {loggedInUser && loggedInUser.role === "Administrator" ? (
                <div>
                    <p>Now you are in Manager view.</p>
                    <Link to="/admin">Go back to Admin View</Link>
                </div>
            ) : (
                <p></p>
            )}
        </div>

    </div>
  );
};

export default ManagerHome;