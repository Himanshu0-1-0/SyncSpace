import './App.css';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import Whiteboard from './Components/Whiteboard/Whiteboard';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './Firebase';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from './UserContext'; // Import the UserProvider

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const boardId = "board-1";
  const userId = "abc";

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/login";
    });
  };

  return (
    <UserProvider> {/* Wrap your app with the UserProvider */}
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuth ? (
                <Home onLogout={signUserOut} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/whiteboard" element={<Whiteboard boardId={boardId} userId={userId} />} />
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
