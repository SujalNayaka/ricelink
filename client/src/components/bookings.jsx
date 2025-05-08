import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import './bookings.css';

const Bookings = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    const payload = {
      clientname: sessionStorage.getItem('current-users'),
      clientmail: sessionStorage.getItem('current-users-mail'),
    };

    const response = await fetch('https://ricelink-server.onrender.com/mybookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log(result);
    setOrders(result);
  };

  const togglePaymentCard = (e) => {
    const card = e.target.closest('.booking-box')?.querySelector('.details-panel');
    if (card) card.style.display = 'flex';
    e.target.style.display = 'none';
  };

  const confirmPayment = async (e) => {
    const card = e.target.closest('.details-panel');
    const agreement = card.querySelector('.confirmpayment')?.value;
    if (agreement !== 'I agree') {
      card.querySelector('.confirmpayment').style.border = '1px solid red';
      return;
    }

    const bookingCard = e.target.closest('.booking-box');
    const paymentDetails = {
      bankname: card.querySelector('.bankname')?.value,
      accountno: card.querySelector('.accountno')?.value,
      reciever: card.querySelector('.servicename')?.innerText,
      clientmail: sessionStorage.getItem('current-users-mail'),
      amount: bookingCard.querySelector('#total')?.innerText,
      servicename: bookingCard.querySelector('.servicename')?.innerText,
      _id: bookingCard.querySelector('.booking-id')?.innerText,
    };

    const res = await fetch('https://ricelink-server.onrender.com/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentDetails),
    });

    const data = await res.json();
    if (data.message === 'Success') {
      card.style.display = 'none';
      bookingCard.querySelector('.paynowbtn').style.display = 'none';
    } else {
      alert('Payment error');
    }
  };

  const confirmReceived = async (e) => {
    const bookingCard = e.target.closest('.booking-box');
    const bookingId = bookingCard.querySelector('.booking-id')?.innerText;

    const res = await fetch('https://ricelink-server.onrender.com/recievedorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id: bookingId }),
    });

    const result = await res.json();
    if (result.message === 'Success') {
      bookingCard.querySelector('#status').innerText = 'Status: Received';
      e.target.style.display = 'none';
    } else {
      alert('Failed to update order status.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="heading">
        <h6>Check status, provider responses, and service details anytime.</h6>
      </div>

      <div className="bookings-wrapper">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div className="booking-box" key={order._id}>
              <h4>Order Summary</h4>
              <div className="booking-id" style={{ display: 'none' }}>{order._id}</div>

              <div className="booking-info"><strong>{order.servicename}</strong></div>
              <div className="servicename" style={{ display: 'none' }}>{order.district}</div>
              <div className="booking-info">Provider: {order.serviceusername}</div>
              <div className="booking-info">Email: {order.servicemail}</div>
              <div className="booking-info">Phone: {order.servicephone}</div>
              <div className="booking-info">Product: {order.product}</div>
              <div className="booking-info">{order.quantity} Tonnes</div>
              <div className="booking-info">Your Bid: ₹{order.bidprice}/tonne</div>
              <div className="booking-info" id="total" style={{ backgroundColor: '#f9ffbb' }}>
                Total: ₹{parseInt(order.quantity) * parseInt(order.bidprice)}/-
              </div>
              <div className="booking-info" id="status" style={{ fontWeight: 600 }}>
                Status: {order.status}
              </div>

              {order.paymentstatus === 'Pending' && order.status.includes('Accepted') && (
                <button className="action-btn paynowbtn" onClick={togglePaymentCard}>
                  Pay Now
                </button>
              )}

              {order.status !== 'Delivered' && (
                <button className="action-btn delivered" onClick={confirmReceived}>
                  Received Order
                </button>
              )}

              <div className="details-panel">
                <h4>Pay via Card</h4>
                <input type="text" placeholder="Bank Name" className="bankname" />
                <div className="servicename" style={{ display: 'none' }}>{order.serviceusername}</div>
                <input type="text" placeholder="Account Number" className="accountno" />
                <div className="confirm-section">
                  <input type="text" className="confirmpayment" placeholder='Type "I agree"' />
                  <span>
                    Paying ₹{parseInt(order.quantity) * parseInt(order.bidprice)}/-
                  </span>
                </div>
                <button onClick={confirmPayment}>Proceed</button>
              </div>
            </div>
          ))
        ) : (
          <p>No bookings yet.</p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Bookings;
