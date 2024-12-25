import React,  { useEffect, useState } from "react";
import "./Home.css";

const Home = ({ onLogout }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    picture: "",
  });
  console.log(user)


  // Fetch user data from localStorage
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const userPhoto = localStorage.getItem("userPhoto");
    setUser({
      name: userName || "Unknown User",
      email: userEmail || "No Email Found",
      picture: userPhoto || "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg",
    });
  }, []);

  return (
    <div className="home-container">
      {/* Sidebar for Profile Info */}
      <div className="sidebar">
        <p>PROFILE</p>
        <img src={user.picture} alt="profile-pic" className="profile-picture" />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        
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
