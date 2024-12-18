import React from 'react'
import './Login.css'
import { auth, provider } from '../../Firebase'
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import image from "./image.png";

const Login = ({setIsAuth}) => {

    let navigate=useNavigate();

    const signInWithGoogle=()=>{
        signInWithPopup(auth, provider).then((result)=>{
            localStorage.setItem("isAuth",true);
            setIsAuth(true);
            navigate("/");
        })
    }
  return (
    <div className="loginWrapper">
        
        <div className="loginImg">
        <p> Sign in with Google to Continue...</p>
            <img src={image} alt="" />
        <button className='gmail_button' onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
      
    </div>
  )
}

export default Login

