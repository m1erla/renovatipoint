import React, { useState } from 'react';
import "./componentCss/forgotpassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/your-api-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Email sent successfully');
        } else {
          console.error('Failed to send email');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className='container a'>
      <h2>yeni şifre isteği</h2>
      <p>E-posta adresinizi giriniz. Size yeni şifre oluşturabileceğiniz bir bağlantı göndereceğiz.</p>
      <form className='forgotForm' onSubmit={handleSubmit}>
        <div>
          <label>E-posta</label>
          <input
            type='email'
            required
            className='forgotInput'
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <button type="submit" className='forgotBtn'>Gönder</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
