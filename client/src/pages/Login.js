import React, { useState } from 'react';
import "./pagesCss/login.css"
import { Link } from 'react-router-dom';
import {FcGoogle} from "react-icons/fc"
import {BiLogoFacebookCircle} from "react-icons/bi"
import {MdOutlineLocalPostOffice} from "react-icons/md"

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = () => {
    if (email === '') {
      setEmailError('Email field cannot be left blank');
      return;
    } else {
      setEmailError('');
    }

    if (password === '') {
      setPasswordError('Password field cannot be left blank');
      return;
    } else {
      setPasswordError('');
    }

    // Form verilerini backend'e gönder
    fetch('your-backend-api-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
    .then(response => response.json())
    .then(data => {
      // Handle API response here (örneğin, oturum açma başarılı mı, hata mı?)
    })
    .catch(error => {
      // Handle error
    });
  };

  return (
    <div className='loginPage'>
      <form method='post' className="loginForm">
        <h1>Login</h1>
        <div>
          <label>Email:</label>
          <input
            type="email"
            className='textInput'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <div className="error">{emailError}</div>}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            className='textInput'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <div className="error">{passwordError}</div>}
        </div>
        <Link onClick={() => window.scrollTo(0, 0)} to="*" className='forgetPassword'>Forgot password ?</Link>
        <button className='loginBtn' onClick={handleLogin}>Login</button>
      </form>
      <div className='fastLogin'>
        <p>Or go fast</p>
        <Link className='fastLoginSocialBtn'><MdOutlineLocalPostOffice /> Login without password</Link>
        <Link className='fastLoginSocialBtn'><FcGoogle /> Google/Gmail</Link>
        <Link className='fastLoginSocialBtn'><BiLogoFacebookCircle /> Facebook</Link>
        <p className='fastLogintext'>Your personal information will not be shared with us.</p>
      </div>
    </div>
  );
}

export default Login;
