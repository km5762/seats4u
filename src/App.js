import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import CustomerHome from "./pages/CustomerHome";
import ManagerHome from "./pages/ManagerHome";
import AdminHome from "./pages/AdministratorHome";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  // const handleNavigate = (role) => {
  //   switch (role) {
  //     case 1:
  //       console.log("1");
  //       return <Navigate to="/admin" />;
  //     case 2:
  //       console.log("2");
  //       return <Navigate to="/manager" />;
  //     default:
  //       return null;
  //   }
  // };
    
  

  const handleLogout = () => {
    // Reset the loggedInUser state to null upon logout
    setLoggedInUser(null);
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" 
          element={<Login setLoggedInUser={setLoggedInUser}
            />} />
          <Route
            path="/"
            element={
              <CustomerHome
                loggedInUser={loggedInUser}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/manager"
            element={
              <ManagerHome
                loggedInUser={loggedInUser}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/admin"
            element={
              <AdminHome loggedInUser={loggedInUser} onLogout={handleLogout} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
