import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import "../App.css"; // Import the CSS file
import {VenueManager, Administratot} from '../model/Model';



const Login = ({ setLoggedInUser}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(null); // Track the selected circle
  const navigate = useNavigate();
  const [loadingMessage, setLoadingMessage] = useState(""); // Track loading message

  
  const handleLogin = async () => {
    // Simulate login logic (you would typically perform an API call here)

    setLoadingMessage("Logging in... This might take some seconds.");
    console.log(username, password);
    try {
      const res = await fetch(
        "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/signin",
        {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username, password: password }),
        }
      );

      const data = await res.json();

      if (data && data.user) {
        if (data.user.role_id === 2) {
          if (data.venue && data.venue.length > 0) {
            if (data.venue.length === 1) {
              const singleVenue = data.venue[0];
              console.log("Only one venue found:", singleVenue);
              // Venue manager with a single venue
              navigate('/manager', { state: { userData: data } });
              
            } 
          } else {
            console.log("No venues found in the response");
            navigate('/manager', { state: { userData: data } });
            console.log(res);
            console.log(data);
          }

          // Set the logged-in user
          setLoggedInUser(data.user);
        } else if (data.user.role_id === 1) {
          // Redirect to '/admin'
          navigate('/admin', { state: { userData: data } });
        } else {
          console.log("User doesn't have the required role for this action");
        }
      } else {
        console.log("Invalid user data or role information");
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
    }
    // For simplicity, just set the logged-in user to the entered username
    // setLoggedInUser({ username, role });
  };
  
  const handleCircleClick = (roleNumber, e) => {
    e.preventDefault();
    setRole(roleNumber);
  };

  return (
    
    <div>
      <div className="center-container">
        <img src="/pictures/logo.png" alt="Logo" width="250" height="100" />
        <h2>Login</h2>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* <div>
          <p>Please select a role:</p>
          {[1, 2, 3].map((roleNumber) => (
            <div key={roleNumber} className="circle-container">
              <div
                className={`circle ${role === roleNumber ? "filled" : ""}`}
                onClick={(e) => handleCircleClick(roleNumber, e)}
              ></div>
              <span className="circle-text">{circleRoleMap[roleNumber]}</span>
            </div>
          ))}
        </div> */}        
        <button onClick={handleLogin} >Login</button>
        {loadingMessage && <div className="loading-message">{loadingMessage}</div>}
      </div>
    </div>
  );
};

export default Login;
