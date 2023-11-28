import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Import the CSS file

const Login = ({ onLogin, loadingMessage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(null); // Track the selected circle
  const navigate = useNavigate();

  const handleClick = async () => {
    // Access onLogin function here
    await onLogin(username, password);
  };

  // Mapping between circle numbers and roles
  // const circleRoleMap = {
  //   1: "Customer",
  //   2: "Manager",
  //   3: "Administrator",
  // };

  // const handleLogin = () => {

  //   setLoadingMessage("Logging in... This might take some seconds."); // Set loading message

  //   if (username && password && role !== null) {
  //     onLogin(username, password);

  //     // Redirect based on the selected circle
  //     switch (role) {
  //       case 1:
  //         navigate("/");
  //         break;
  //       case 2:
  //         navigate("/manager");
  //         break;
  //       case 3:
  //         navigate("/admin");
  //         break;
  //       default:
  //         break;
  //     }
  //   } else {
  //     alert("Please enter both username and password.");
    // }
  // };

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

        {loadingMessage && <div className="loading-message">{loadingMessage}</div>}
        <button onClick={handleClick}>Login</button>
      </div>
    </div>
  );
};

export default Login;
