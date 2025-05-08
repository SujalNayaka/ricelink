import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import './transport.css';

const Transport = () => {
  const [userdet, setUserdet] = useState({ loogedin: {} });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    handleuser();
    handleorders();
  }, []);

  const handleuser = async () => {
    const data = {
      username: sessionStorage.getItem('current-users'),
      mail: sessionStorage.getItem('current-users-mail'),
    };

    try {
      const res = await fetch('https://ricelink-server.onrender.com/transportservices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const data1 = await res.json();
      setUserdet({ loogedin: data1.loggedin });
    } catch (err) {
      console.error('User not logged in or error fetching user', err);
    }
  };

  const handleorders = async () => {
    const data = {
      serviceusername: sessionStorage.getItem('current-users'),
      servicemail: sessionStorage.getItem('current-users-mail'),
    };

    try {
      const res = await fetch('https://ricelink-server.onrender.com/logisticorders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const data1 = await res.json();
      setOrders(data1);
    } catch (err) {
      console.error('Error fetching orders', err);
    }
  };

  const handleOrderUpdate = async (e, type) => {
    const orderEl = e.target.closest('.order');
    const data = {
      _id: orderEl.querySelector('.orderedid').innerText,
      currentid: orderEl.querySelector('.orderid').innerText,
      regno: orderEl.querySelector('#lorryno').value,
      currentlocation: orderEl.querySelector('#currentlocation').value,
    };

    const endpoint =
      type === 'accept'
        ? 'https://ricelink-server.onrender.com/accepttransportorder'
        : 'https://ricelink-server.onrender.com/rejecttransportorder';

    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });

    const data1 = await res.json();
    if (data1.message === 'Success') {
      orderEl.querySelector('.status').innerText = `Status: ${type === 'accept' ? 'Accepted' : 'Rejected'}`;
      orderEl.querySelector('.det').style.display = 'none';
    } else {
      alert('Error processing order');
    }
  };

  return (
    <>
      <Navbar />
      <div className="heading">
        <h4>View All the Services You've Been Booked For.</h4>
        <h6>Stay updated and respond to customer requests quickly.</h6>
      </div>

      <div className="personaldata">
        <div className="milldet">Servicename: {userdet.loogedin.servicename}</div>
        <div className="milldet">District: {userdet.loogedin.District}</div>
        <div className="milldet">Name: {userdet.loogedin.username}</div>
        <div className="milldet">Description: {userdet.loogedin.description}</div>
        <div className="milldet">Phone: {userdet.loogedin.phone}</div>
        <div className="milldet">Mail: {userdet.loogedin.mail}</div>
        <div className="milldet">Price per Tonne: Rs {userdet.loogedin.price}/-</div>
      </div>

      <div className="orders">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div className="order" key={order._id}>
              <h3 className="orderid" style={{ display: 'none' }}>{order._id}</h3>
              <h3 className="orderedid" style={{ display: 'none' }}>{order.orderid}</h3>

              <h3>Product: {order.product}</h3>
              <h3>Client Name: {order.servicename}</h3>
              <h3>Quantity: {order.quantity} Tonnes</h3>
              <h3>Ship To: {order.to}</h3>
              <h3>Ship From: {order.from}</h3>
              <h3>Total: Rs {order.total}/-</h3>
              <h3 className="status">Status: {order.status}</h3>

              {order.status === 'Pending' && (
                <div className="det" style={{ width: '100%' }}>
                  <div className="lorrydet">
                    <input type="text" placeholder="Enter Lorry Registration Number" id="lorryno" />
                    <input type="text" placeholder="Enter Current District" id="currentlocation" />
                  </div>
                  <div className="buttons">
                    <button className="accept" onClick={(e) => handleOrderUpdate(e, 'accept')}>Accept Order</button>
                    <button className="reject" onClick={(e) => handleOrderUpdate(e, 'reject')}>Reject Order</button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div>No orders</div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Transport;
