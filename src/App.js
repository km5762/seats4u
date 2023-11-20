import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import CustomerHome from './pages/CustomerHome';
import ManagerHome from './pages/ManagerHome';
import AdminHome from './pages/AdministratorHome';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (username, role) => {
    setLoggedInUser({ username, role });
  };

  const handleLogout = () => {
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