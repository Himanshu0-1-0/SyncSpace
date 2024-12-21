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
        <p>
        <h1>SyncSpace</h1>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam delectus adipisci tempore ullam, officia labore debitis facilis sapiente accusantium ut laudantium similique impedit harum, laboriosam nisi quia in doloremque vero. Facilis quae, et debitis aperiam dolores tempora excepturi, placeat cumque odit corrupti similique dolore suscipit quidem possimus? Non quisquam, provident modi laborum id quaerat? Ad nobis similique beatae. Molestias dolorum exercitationem soluta repudiandae blanditiis, laboriosam, quas ipsa explicabo illum, modi eos vitae aperiam illo error dolor alias ex suscipit? Velit soluta iusto necessitatibus quidem labore odit possimus excepturi quos, quo rerum similique placeat inventore sed? Distinctio nihil enim ut quam.</p>
        <div className="loginImg">
            <img src={image} alt="" />
        <button className='gmail_button' onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
      
    </div>
  )
}

export default Login

