import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../component/SearchBar';

const AdminHome = ({ loggedInUser, onLogout }) => {

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log(`Search query: ${searchQuery}`);
  };

  return (
    <div>

        <div className="center-container">
          <img src='/pictures/logo.png' alt="Logo" width="250" height="100" />
        </div>

        <div className="upper-right-text">
            {loggedInUser ? (
                <div>
                    <p>Welcome back, {loggedInUser.role} {loggedInUser.username}! Now you may administrate.</p>
                    <button onClick={onLogout}>Logout</button>
                    <Link to="/">Customer View</Link>
                    <Link to="/manager">Manager View</Link>
                </div>
            ) : (
                <div>
                    <p>Logged out</p>
                    <Link to="/">Go back to home page</Link>
                    <p>Or <Link to="/login">log in</Link> again here</p>
                </div>
            )}
        </div>

        <div className="center-container">
          <SearchBar onSearch={handleSearch} /> 
        </div>

    </div>
  );
};

export default AdminHome;