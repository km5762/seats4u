import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../component/SearchBar';

const CustomerHome = ({ loggedInUser, onLogout }) => {

  const [searchQuery, setSearchQuery] = useState('');

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


  return (
    <div>
        <div className="center-container">
          <img src='/pictures/logo.png' alt="Logo" width="250" height="100" />
        </div>

        <div style={{ position: 'absolute', left: 650, top:120 }}>
              <SearchBar onSearch={handleSearch} /> 
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