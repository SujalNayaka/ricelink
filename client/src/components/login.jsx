import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  // State variables for login, signup, service, and transport signup
  const [login, setLogin] = useState({ username: '', password: '' });
  const [signup, setSignup] = useState({
    username: '',
    phone: '',
    role: '',
    mail: '',
    password: '',
    District: '',
    address: '',
  });
  const [signupservices, setSignupservices] = useState({
    username: '',
    servicename: '',
    phone: '',
    mail: '',
    description: '',
    District: '',
    address: '',
    price: '',
    stock: '',
  });
  const [signuptransport, setSignuptransport] = useState({
    username: '',
    servicename: '',
    phone: '',
    mail: '',
    description: '',
    District: '',
    address: '',
    price: '',
  });

  // Handle login form changes
  const handleLogin = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  // Handle signup form changes
  const handleSignup = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  // Handle service provider signup form changes
  const handleSignupservices = (e) => {
    setSignupservices({ ...signupservices, [e.target.name]: e.target.value });
  };

  // Handle transport provider signup form changes
  const handleSignuptransport = (e) => {
    setSignuptransport({ ...signuptransport, [e.target.name]: e.target.value });
  };

  // Submit login
  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', login);
      if (response.data.success) {
        document.getElementById('logincont').style.display = 'none';
        document.getElementById('newusercont').style.display = 'block';
        document.getElementById('welcomebackcont').style.display = 'block';
      } else {
        alert('Login failed');
      }
    } catch (error) {
      alert('Error logging in');
    }
  };

  // Submit customer signup
  const submitSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/signup', signup);
      if (response.data.success) {
        document.getElementById('signupcont').style.display = 'none';
        document.getElementById('newusercont').style.display = 'block';
      } else {
        alert('Signup failed');
      }
    } catch (error) {
      alert('Error signing up');
    }
  };

  // Submit service provider signup
  const submitserviceSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/signup_service', signupservices);
      if (response.data.success) {
        document.getElementById('signup_services').style.display = 'none';
        document.getElementById('newusercont').style.display = 'block';
      } else {
        alert('Service provider signup failed');
      }
    } catch (error) {
      alert('Error signing up service provider');
    }
  };

  // Submit transport provider signup
  const submittransportSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/signup_transport', signuptransport);
      if (response.data.success) {
        document.getElementById('signup_transport').style.display = 'none';
        document.getElementById('newusercont').style.display = 'block';
      } else {
        alert('Transport provider signup failed');
      }
    } catch (error) {
      alert('Error signing up transport provider');
    }
  };

  return (
    <div>
      {/* Login Form */}
      <div id="logincont" className="logincont">
        <div>Login</div>
        <input
          name="username"
          value={login.username}
          onChange={handleLogin}
          placeholder="Username"
        />
        <input
          name="password"
          type="password"
          value={login.password}
          onChange={handleLogin}
          placeholder="Password"
        />
        <button onClick={submitLogin}>Login</button>
      </div>

      {/* New User Content */}
      <div id="newusercont" className="newusercont">
        {/* Choose between Customer, Service Provider, or Transport Provider */}
        <button id="newcustomer" onClick={() => document.getElementById('signupcont').style.display = 'block'}>
          New Customer
        </button>
        <button id="newservice" onClick={() => document.getElementById('signup_services').style.display = 'block'}>
          New Service Provider
        </button>
        <button id="newtransport" onClick={() => document.getElementById('signup_transport').style.display = 'block'}>
          New Transport Provider
        </button>
      </div>

      {/* Signup for Customer */}
      <div id="signupcont" className="signupcont">
        <div>Signup - Customer</div>
        <input
          name="username"
          value={signup.username}
          onChange={handleSignup}
          placeholder="Username"
        />
        <input
          name="phone"
          value={signup.phone}
          onChange={handleSignup}
          placeholder="Phone"
        />
        <input
          name="role"
          value={signup.role}
          onChange={handleSignup}
          placeholder="Role"
        />
        <input
          name="mail"
          value={signup.mail}
          onChange={handleSignup}
          placeholder="Email"
        />
        <input
          name="password"
          type="password"
          value={signup.password}
          onChange={handleSignup}
          placeholder="Password"
        />
        <input
          name="District"
          value={signup.District}
          onChange={handleSignup}
          placeholder="District"
        />
        <input
          name="address"
          value={signup.address}
          onChange={handleSignup}
          placeholder="Address"
        />
        <button onClick={submitSignup}>Sign Up</button>
      </div>

      {/* Signup for Service Provider */}
      <div id="signup_services" className="signup_services">
        <div>Signup - Service Provider</div>
        <input
          name="username"
          value={signupservices.username}
          onChange={handleSignupservices}
          placeholder="Username"
        />
        <input
          name="servicename"
          value={signupservices.servicename}
          onChange={handleSignupservices}
          placeholder="Service Name"
        />
        <input
          name="phone"
          value={signupservices.phone}
          onChange={handleSignupservices}
          placeholder="Phone"
        />
        <input
          name="mail"
          value={signupservices.mail}
          onChange={handleSignupservices}
          placeholder="Email"
        />
        <input
          name="description"
          value={signupservices.description}
          onChange={handleSignupservices}
          placeholder="Description"
        />
        <input
          name="District"
          value={signupservices.District}
          onChange={handleSignupservices}
          placeholder="District"
        />
        <input
          name="address"
          value={signupservices.address}
          onChange={handleSignupservices}
          placeholder="Address"
        />
        <input
          name="price"
          value={signupservices.price}
          onChange={handleSignupservices}
          placeholder="Price"
        />
        <input
          name="stock"
          value={signupservices.stock}
          onChange={handleSignupservices}
          placeholder="Stock"
        />
        <button onClick={submitserviceSignup}>Sign Up</button>
      </div>

      {/* Signup for Transport Provider */}
      <div id="signup_transport" className="signup_transport">
        <div>Signup - Transport Provider</div>
        <input
          name="username"
          value={signuptransport.username}
          onChange={handleSignuptransport}
          placeholder="Username"
        />
        <input
          name="servicename"
          value={signuptransport.servicename}
          onChange={handleSignuptransport}
          placeholder="Service Name"
        />
        <input
          name="phone"
          value={signuptransport.phone}
          onChange={handleSignuptransport}
          placeholder="Phone"
        />
        <input
          name="mail"
          value={signuptransport.mail}
          onChange={handleSignuptransport}
          placeholder="Email"
        />
        <input
          name="description"
          value={signuptransport.description}
          onChange={handleSignuptransport}
          placeholder="Description"
        />
        <input
          name="District"
          value={signuptransport.District}
          onChange={handleSignuptransport}
          placeholder="District"
        />
        <input
          name="address"
          value={signuptransport.address}
          onChange={handleSignuptransport}
          placeholder="Address"
        />
        <input
          name="price"
          value={signuptransport.price}
          onChange={handleSignuptransport}
          placeholder="Price"
        />
        <button onClick={submittransportSignup}>Sign Up</button>
      </div>
    </div>
  );
};

export default Login;
