import './App.css';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import Whiteboard from './Components/Whiteboard/Whiteboard';
import { useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
function App() {

  const[isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));


  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home isAuth={isAuth}/>} />
      <Route path="/whiteboard" element={<Whiteboard/>} />
      <Route path="/login" element={<Login setIsAuth={setIsAuth}/>} />
    </Routes>
  </Router>
  );
}

export default App;
