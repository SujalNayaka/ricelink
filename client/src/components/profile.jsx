import React from 'react'
import Navbar from './navbar'
import './profile.css'
import Footer from './footer'
import { useEffect,useState } from 'react'

const Profile = () => {

   const [userdet, setUserdet] = useState({
        loogedin: {}
    })

    const [payments,setPayments] = useState([]);

    useEffect(()=>{
      
        handleuser();
      // handlepayhistory();
      
    },[])

    const handleuser =async()=>{
      const data = {
          username: sessionStorage.getItem('current-users'),
          mail: sessionStorage.getItem('current-users-mail')
      }
      
      try {
         let search='';
       if( sessionStorage.getItem('user-role')=='Customer'){
         search = 'loginusers'
       }
       else if(sessionStorage.getItem('user-role')=='Provider'){
        search = 'signinservices'
       }
       else{
        search = 'transportservices'
       }

        const res = await fetch(`https://ricelink-server.onrender.com/${search}`, {
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

     const handlepayhistory = async()=>{
      const data = {
        clientmail: sessionStorage.getItem('current-users-mail')
    }
    
    try {
      const res = await fetch('https://ricelink-server.onrender.com/mypayments', {
        method: 'post', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const data1 = await res.json();
      setPayments(data1);
      console.log(data1) 

    } catch (err) {
      console.error("User not logged in or error fetching user", err);
    }
     }

  return (
    <>
      <Navbar/>

      <div className="heading">
            {/* <h4>Welcome Back! Let’s Keep Your Info Up to Date.</h4> */}
            <h6>Edit your profile and stay connected with your services.</h6>
            
        </div>

<div className="userdata"> Personal Details
  <div className="user">Username: {userdet.loogedin.username}</div>
  <div className="user">Phone: {userdet.loogedin.phone}</div>
  {/* <div className="user">Mail: {userdet.loogedin.mail}</div> */}
  <div className="user">District: {userdet.loogedin.District}</div>
</div>

{/* <div className="paymenthistory">  Payments History</div> */}
{/* <div className="payments">

   {
    payments&&payments? payments.map(payment=>{
      return(
       <div className="paymentdet">
         <div className="paydet">{payment.servicename} Rice Mill</div>
         <div className="paydet">Reciever: {payment.reciever}</div>
         <div className="paydet">Bank Name: {payment.bankname}</div>
         <div className="paydet">Account No: {payment.accountno}</div>
         <div className="paydet">{payment.amount}</div>
       </div>
      )
    }):<>No Payments yet.</>
   }
</div> */}

<Footer/>
    </>
  )
}

export default Profile
