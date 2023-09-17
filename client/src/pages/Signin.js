import React, { useState } from 'react';

const Signin = () => {
  const [signinData, setSigninData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSigninData({
      ...signinData,
      [name]: value
    });
  };

  
const apiUrl = `${process.env.REACT_APP_BASE_URL_API}`;

// ...

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${apiUrl}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signinData),
    });

    if (response.ok) {
      // Authentication was successful, you can redirect or perform other actions here.
      console.log("Signin successful!");
    } else {
      // Authentication failed
      console.error("Signin failed");
    }

    // Reset the form after submission if needed
    setSigninData({
      email: "",
      password: ""
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
  }
};

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email/Username:</label>
          <input
            type="text"
            name="email"
            value={signinData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={signinData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Signin;



