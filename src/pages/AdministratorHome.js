import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../component/SearchBar';
import { Administrator } from '../model/Model';

const AdminHome = ({ loggedInUser, onLogout }) => {

  const [administrator, setAdministrator] = React.useState(new Administrator());

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log(`Search query: ${searchQuery}`);
  };
  
  return (
    <div>

        <div className="center-container">
          <img src='/pictures/logo.png' alt="Logo" width="250" height="100" />
        </div>

        <div>
            {loggedInUser ? (
              <div>
                <div className="upper-right-text">
                    <p>Welcome back, {loggedInUser.role} {loggedInUser.username}! Now you may administrate.</p>
                    <button onClick={onLogout}>Logout</button>
                    <Link to="/">Customer View</Link>
                    <Link to="/manager">Manager View</Link>
                </div>

                <div className='middle-container'>
                  {administrator.venues.length ? (
                  <div className='middle-container'>
                    <p>You have {administrator.venues.length} venues.</p>
                    {administrator.venues.map((venue, index) => (
                    <div key={index}>
                        <p>Venue Name: {administrator.venues[index].name}</p>
                        <p>Venue List of shows:</p>
                        {administrator.venues[index].shows.length ? (
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
                          )}
                        <p>-------------------------------------------------</p>
                    </div>
                    ))}
                  </div>)
                  :(
                    <div>
                      No venues yet
                    </div>
                  )
                  }
                </div>
                </div>
            ) : (
                <div className="upper-right-text">
                    <p>Logged out</p>
                    <Link to="/">Go back to home page</Link>
                    <p>Or <Link to="/login">log in</Link> again here</p>
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