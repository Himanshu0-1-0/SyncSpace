import React, { useContext } from "react";
import "./Home.css";
import { UserContext } from "../../UserContext"; // Import the UserContext

const Home = ({ onLogout }) => {
  const { user } = useContext(UserContext); // Get the user from context

  return (
    <div className="home-container">
      {/* Sidebar for Profile Info */}
      <div className="sidebar">
        <p>PROFILE</p>
        <img
          src={user.picture || "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg"}
          alt="profile-pic"
          className="profile-picture"
        />
        <h2>{user.name || "Unknown User"}</h2>
        <p>{user.email || "No Email Found"}</p>

        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Box at the top */}
        <div className="top-box">
          <h3>Top Box Content</h3>
        </div>

        {/* Cards at the bottom */}
        <div className="cards-container">
          {[...Array(6)].map((_, index) => (
            <div className="card" key={index}>
              <h4>Card {index + 1}</h4>
              <p>Card content goes here</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
