import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createVenueC, deleteVenueC } from '../controller/Controller';
import BlockCanvas from '../boundary/Boundary';

const ManagerHome = ({ loggedInUser, onLogout }) => {

  const [venueCreating, setVenueCreating] = useState(false);
  const [venueCreated, setVenueCreated] = useState(false);

  const [venueName, setVenueName] = useState('');
  const [leftRow, setLeftRow] = useState('');
  const [leftCol, setLeftCol] = useState('');
  const [rightRow, setRightRow] = useState('');
  const [rightCol, setRightCol] = useState('');
  const [centerRow, setCenterRow] = useState('');
  const [centerCol, setCenterCol] = useState('');

  const creatingVenue = () => {
        setVenueCreating(true);
    };

  const createVenue = () => {
        createVenueC(venueName, leftRow, leftCol, rightRow, rightCol, centerRow, centerCol);
        setVenueCreated(true);
    };

   const deleteVenue = () => {
        deleteVenueC();
        setVenueCreating(false);
        setVenueCreated(true);
    };

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
                {!venueCreating && loggedInUser ? (
                    <div className="center-container">
                        <p>No Venue Yet</p>
                        <p>Please Create a Venue</p>
                        <button onClick={creatingVenue}>Create a Venue</button>
                    </div>
                ) : (
                    <div>
                        {!venueCreated ? (
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
                                    <p>Left</p>
                                    <BlockCanvas col={leftCol} row={leftRow} style={{ marginRight: '20px' }}/>
                                </div>
                                <div className="cSection">
                                    <p>Center</p>
                                    <BlockCanvas col={centerCol} row={centerRow} style={{ marginRight: '20px' }}/>
                                </div>
                                <div className="rSection">
                                    <p>Right</p>
                                    <BlockCanvas col={rightCol} row={rightRow} style={{ marginRight: '20px' }}/>
                                </div>
                            </div>
                        ) : (
                            <div className="center-container">
                                <p>Your Venue: {venueName}</p>
                                <button>Create Show</button>
                                <button onClick={deleteVenue}>Delete Venue</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        ) : (
            <p></p>
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