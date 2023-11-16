import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../component/SearchBar';

const CustomerHome = ({ loggedInUser, onLogout }) => {

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log(`Search query: ${searchQuery}`);
  };

  return (
    <div>
        <div className="center-container">
          <img src='/pictures/logo.png' alt="Logo" width="250" height="100" />
        </div>

        <div className="center-container">
          <SearchBar onSearch={handleSearch} /> {/* Use the SearchBar component */}
        </div>
        
        <div className="upper-right-text">
          {loggedInUser ? (
            <div>
              <p>Welcome back, {loggedInUser.role} {loggedInUser.username}! Now you may purchase tickets.</p>
              <button onClick={onLogout}>Logout</button>
            </div>
          ) : (
              <p>You can view the shows. Please <Link to="/login">log in</Link> to purchase tickets.</p>
          )}
        </div>

        <div className="lower-right-text">
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
        </div>
    </div>
  );
};

export default CustomerHome;