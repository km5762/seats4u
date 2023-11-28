import React, { useState } from 'react';

const HomePage = ({ onHome }) => {

  const handleHome = () => {
    // Find some way to navigate to the relevant dashboard
    onHome();
  };

  return (
    <div>
      <button onClick={handleHome}>Home Page</button>
    </div>
  );
};

export default SearchBar;
