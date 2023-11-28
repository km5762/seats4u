import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import CustomerHome from "./pages/CustomerHome";
import ManagerHome from "./pages/ManagerHome";
import AdminHome from "./pages/AdministratorHome";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(""); // Track loading message

  const handleLogin = async (username, password) => {
    // Simulate login logic (you would typically perform an API call here)

    setLoadingMessage("Logging in... This might take some seconds.");
    const res = await fetch(
      "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/signin",
      {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password }),
      }
    );


    const res2 = await fetch(
      "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/createvenue",
      { credentials: "include", method: "POST" }
    );
    // For simplicity, just set the logged-in user to the entered username
    // setLoggedInUser({ username, role });
  };

  const handleLogout = () => {
    // Reset the loggedInUser state to null upon logout
    setLoggedInUser(null);
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" 
          element={<Login onLogin={handleLogin}
          loadingMessage = {loadingMessage}
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
