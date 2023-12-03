import React, { useState, useEffect } from 'react';

const SpecificSearchBar = ({ onSearch, initialSearchQuery }) => {
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  
    useEffect(() => {
      // If the initial search query changes, update the local state
      setSearchQuery(initialSearchQuery || '');
    }, [initialSearchQuery]);
  
    const handleSearch = () => {
      // Pass the search query to the parent component or perform a search operation
      onSearch(searchQuery);
    };
  
    return (
      <div>
        {/* <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        /> */}
        <button onClick={handleSearch}>Get list of shows in this venue</button>
      </div>
    );
  };

export default SpecificSearchBar;