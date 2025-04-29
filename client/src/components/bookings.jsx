import React from 'react'
import Navbar from './navbar'
import './bookings.css'
import Footer from './footer'
import { useEffect, useState } from 'react'

const Bookings = () => {

  const [bookings,setbookings] = useState([]);

  useEffect(()=>{
    handlefetchbookings();
  },[])

  const handlefetchbookings = async()=>{
    const data = {
      clientname: sessionStorage.getItem('current-users'),
      clientmail: sessionStorage.getItem('current-users-mail')
  }
  const res = await fetch('https://ricelink-server.onrender.com/mybookings', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data1 = await res.json();
  console.log(data1)
  setbookings(data1);
  }


  const handlepayment = (e)=>{
   e.target.style.display = 'none'
   e.target.closest('.booking').querySelector('.card-det').style.display = 'flex'
  }

  const confirmpayment = async(e)=>{
   if(e.target.closest('.card-det').querySelector('.confirmpayment').value == 'I agree'){
    const data = {
      bankname:e.target.closest('.card-det').querySelector('.bankname').value,
      accountno:e.target.closest('.card-det').querySelector('.accountno').value,
      reciever:e.target.closest('.card-det').querySelector('.servicename').innerText,
      clientmail: sessionStorage.getItem('current-users-mail'),
      amount: e.target.closest('.booking').querySelector('#total').innerText,
      servicename:e.target.closest('.booking').querySelector('.servicename').innerText,
    _id:e.target.closest('.booking').querySelector('.id').innerText
    }

    const res = await fetch('https://ricelink-server.onrender.com/payment', {
     method: 'post',
     body: JSON.stringify(data),
     headers: {
       "Content-Type": "application/json"
     }
   });
   const data1 = await res.json();
   if(data1.message === 'Success'){
       
       e.target.closest('.card-det').style.display = 'none'
       e.target.closest('booking').querySelector('.paynowbtn').style.display = 'none'
     

   }else{
       alert('Error')
   }
   }
   else{
    e.target.closest('.card-det').querySelector('.confirmpayment').style.border = '1px solid red'
   }
  }

  const handledelivered= async(e)=>{
    const data = {
      _id: e.target.closest('.booking').querySelector('.id').innerText      
      }
       
      const res = await fetch('https://ricelink-server.onrender.com/recievedorder', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data1 = await res.json();
      if(data1.message === 'Success'){
          e.target.closest('.booking').querySelector('#status').innerText = 'Status: Recieved'
          e.target.style.display = 'none'
      }else{
          alert('Error')
      }
  }

  return (
    <>
      <Navbar/>

      <div className="heading">
            <h4>Manage Your Bookings with Ease.</h4>
            <h6>Check status, provider responses, and service details anytime.</h6>
            
        </div>

    <div className="yourbookings">
    {
        bookings&&bookings? bookings.map(order=>{
          return(
            <div className="booking">
              <h4 style={{margin:'0.5vw 0'}}>Order Summary</h4>
              <div className="id">{order._id}</div>
              
              <div className="bookingdet"><h4>{order.district} Rice Mill</h4></div>
              <div className="servicename" style={{display:'none'}}>{order.district}</div>
              <div className="bookingdet">Provider: {order.serviceusername}</div>
              <div className="bookingdet">Mail at: {order.servicemail}</div>
              <div className="bookingdet">Call Us: {order.servicephone}</div>
              <div className="bookingdet">Product: {order.product}</div>
              <div className="bookingdet">{order.quantity} Tonnes.</div>
              <div className="bookingdet">Your Bid: Rs {order.bidprice}/- per Tonne</div>
              <div className="bookingdet" id='total' style={{backgroundColor:'#f9ffbb'}}>Total: Rs {parseInt(order.quantity)*parseInt(order.bidprice)}/-</div>
              <div className="bookingdet" id='status' style={{fontWeight:600}}>Status: {order.status}</div>

             {
              order.paymentstatus==='Pending'?
              <button onClick={handlepayment} className='paynowbtn' style={{display:order.status.includes('Accepted')?'block':'none'}}>Pay Now</button>
              :<></>
             }

             {
              order.status!='Delivered'?
              <button onClick={handledelivered} className='delivered'>Received Order</button>
              :<></>
             }

              <div className="card-det">
       <h4>Pay via Card</h4>
       <input type="text"  placeholder='Bankname' className='bankname'/>
       <div className="servicename" style={{display:'none'}}>{order.serviceusername}</div>
        <input type="text"  placeholder='Account Number' className='accountno'/>
      <div className="confirm">  <input type="Text" className='confirmpayment' placeholder='Type "I agree"'/><span>Paying  Rs {parseInt(order.quantity)*parseInt(order.bidprice)}/-</span></div>
     
        <button onClick={confirmpayment}>Proceed</button>
    </div>
            </div>
          )
        })
              
        :<>No bookings done yet.</>
      }
    </div>

   <Footer/>
    </>
  )
}

export default Bookings
