import React from "react";
import "./Home.css";

const Home = ({ user, onLogout }) => {
  return (
    <div className="home-container">
      {/* Sidebar for Profile Info */}
      <div className="sidebar">
        <p>PROFILE</p>
        <img src={user.picture} alt="Profile-pic" className="profile-picture" />
        {/* <h2>{user.name}</h2>
        <p>{user.email}</p> */}
        <h2>NAME</h2>
        <p>EMAIL</p>
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
