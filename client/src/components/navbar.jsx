import React, { useState, useEffect } from 'react';
import './navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showBookings, setShowBookings] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInStatus = sessionStorage.getItem('isloggedin');
    const role = sessionStorage.getItem('user-role');
    
    setIsLoggedIn(loggedInStatus === 'true');
    setUserRole(role);

    // Handle visibility of "Your Bookings" button
    if (role === 'Provider' || role === 'Transport') {
      setShowBookings(false);
    } else {
      setShowBookings(true);
    }
  }, [isLoggedIn, userRole]);

  const handleSignIn = () => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user-role');
    sessionStorage.setItem('isloggedin', false);
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/');
  };

  const handleMyBookings = () => {
    if (isLoggedIn) {
      navigate('/bookings');
    } else {
      alert('Please sign in to view your bookings');
    }
  };

  const handleProfile = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      alert('Please sign in to view your profile');
    }
  };

  const handleHome = () => {
    if (userRole === 'Provider') {
      navigate('/serviceprovider');
    } else if (userRole === 'Transport') {
      navigate('/transport');
    } else {
      navigate('/');
    }
  };

  return (
    <div className='navbar'>
      <div className="head">Grain Works</div>
      <div className="selbtns">
        <button onClick={handleHome}>Home</button>
        <button onClick={handleSignIn}>
          {isLoggedIn ? 'Logout' : 'Sign In'}
        </button>
        {showBookings && <button onClick={handleMyBookings}>Your Bookings</button>}
        <button onClick={handleProfile}>Profile</button>
      </div>
    </div>
  );
};

export default Navbar;
