import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import CustomerHome from './pages/CustomerHome';
import ManagerHome from './pages/ManagerHome';
import AdminHome from './pages/AdministratorHome';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (username, role) => {
    // Simulate login logic (you would typically perform an API call here)
    // For simplicity, just set the logged-in user to the entered username
    setLoggedInUser({ username, role });
  };

  const handleLogout = () => {
    // Reset the loggedInUser state to null upon logout
    setLoggedInUser(null);
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route
            path="/"
            element={<CustomerHome loggedInUser={loggedInUser} onLogout={handleLogout}/>}
          />
          <Route
            path="/manager"
            element={<ManagerHome loggedInUser={loggedInUser} onLogout={handleLogout}/>}
          />
          <Route
            path="/admin"
            element={<AdminHome loggedInUser={loggedInUser} onLogout={handleLogout}/>}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


