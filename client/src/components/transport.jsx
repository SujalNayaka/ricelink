import React from 'react'

import Navbar from './navbar'
import './transport.css'
import Footer from './footer'
import { useState,useEffect } from 'react'

const Transport = () => {
  const [userdet, setUserdet] = useState({
        loogedin: {}
    })
  const [orders, setOrders] = useState([])
    

    useEffect(()=>{
      handleuser()
      handleorders()
    },[])

    const handleuser =async()=>{
      const data = {
          username: sessionStorage.getItem('current-users'),
          mail: sessionStorage.getItem('current-users-mail')
      }
      
      try {
        const res = await fetch('http://localhost:5004/transportservices', {
          method: 'post', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const data1 = await res.json();
        setUserdet({ loogedin: data1.loggedin });
        console.log(data1) 
  
      } catch (err) {
        console.error("User not logged in or error fetching user", err);
      }
  
     }

     const handleorders = async()=>{
      const data = {
        serviceusername: sessionStorage.getItem('current-users'),
        servicemail: sessionStorage.getItem('current-users-mail')
    }
    
    try {
      const res = await fetch('http://localhost:5004/logisticorders', {
        method: 'post', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const data1 = await res.json();
      setOrders(data1);
      console.log(data1) 

    } catch (err) {
      console.error("User not logged in or error fetching user", err);
    }
     }

     const handleAcceptOrder = async(e)=>{
      const data = {
        _id: e.target.closest('.order').querySelector('.orderedid').innerText,
        currentid:e.target.closest('.order').querySelector('.orderid').innerText,
       regno:e.target.closest('.order').querySelector('#lorryno').value,
        currentlocation:e.target.closest('.order').querySelector('#currentlocation').value,
        }
         
        const res = await fetch('http://localhost:5004/accepttransportorder', {
          method: 'post',
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data1 = await res.json();
        if(data1.message === 'Success'){
            e.target.closest('.order').querySelector('.status').innerText = 'Status: Accepted'
            e.target.closest('.det').style.display = 'none'
        }else{
            alert('Error')
        }
     }
     const handleRejectOrder = async (e) => {
      const data = {
        _id: e.target.closest('.order').querySelector('.orderedid').innerText,
        currentid:e.target.closest('.order').querySelector('.orderid').innerText,
       regno:e.target.closest('.order').querySelector('#lorryno').value,
        currentlocation:e.target.closest('.order').querySelector('#currentlocation').value,
        }
       const res = await fetch('http://localhost:5004/rejecttransportorder', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data1 = await res.json();
      if(data1.message === 'Success'){
          e.target.closest('.order').querySelector('.status').innerText = 'Status: Rejected'
          e.target.closest('.det').style.display = 'none'

      }else{
          alert('Error')
      }
   }

  return (
    <>
      <Navbar/>

      <div className="heading">
            <h4>View All the Services You've Been Booked For.</h4>
            <h6>Stay updated and respond to customer requests quickly.</h6>
            
        </div>

      {
          <div className="personaldata">
            <div className="milldet">Servicename: {userdet.loogedin.servicename}</div>
            <div className="milldet">District: {userdet.loogedin.District}</div>
          <div className="milldet">Name: {userdet.loogedin.username}</div>
          <div className="milldet">Description : {userdet.loogedin.description}</div>
          <div className="milldet">Phone : {userdet.loogedin.phone}</div>
          <div className="milldet">Mail : {userdet.loogedin.mail}</div>
          <div className="milldet">Price per Tonne: Rs  {userdet.loogedin.price}/-</div>
          
       
      </div>
      }

<div className="orders">
           {
            orders && orders? orders.map(order=>{
                return(
                    <div className="order" key={order._id}>
                        <h3 className='orderid' style={{display:'none'}}>{order._id}</h3>
                        <h3 className='orderedid' style={{display:'none'}}>{order.orderid}</h3>

                        <h3>Product: {order.product}</h3>
                        <h3>Client Name: {order.servicename}</h3>
                        <h3>Quantity: {order.quantity} Tonnes</h3>
                        <h3>Ship To: {order.to} </h3>
                        <h3>Ship From: {order.from} </h3>
                        <h3>Total: Rs {order.total}/-</h3>
                        <h2 className="requirement" style={{display:'none'}}> {order.quantity}</h2>
                        <h2 className="clientname" style={{display:'none'}}> {order.servicename}</h2>
                        
                        <h2 className="toaddr" style={{display:'none'}}> {order.to}</h2>
                        <h2 className="product" style={{display:'none'}}> {order.product}</h2>
                        
                        <h3 className='status'>Status: {order.status}</h3>

                     
                        
                      {
                        order.status === 'Pending' ?
                         (
                          <div className='det' style={{width:'100%'}}>
                          <div className="lorrydet">
                          <input type="text" placeholder='Enter Lorry Registration Number' id='lorryno'/>
                          <input type="text" placeholder='Enter Current District' id='currentlocation'/>
                          </div>

                            <div className="buttons">
                            <button className='accept' onClick={handleAcceptOrder}>Accept Order</button>
                            <button className='reject' onClick={handleRejectOrder}>Reject Order</button>
                            </div>
                            </div>
                        ):(<></>)
                      }
                 
                    </div>
                )
            }):<>No orders</>
           }
      </div>

   <Footer/>
    </>
  )
}

export default Transport
