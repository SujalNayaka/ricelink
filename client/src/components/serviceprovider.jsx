import React, { useEffect,useState } from 'react'
import Navbar from './navbar'
import './serviceprovider.css'
import Footer from './footer'


const Serviceprovider = () => {

    const [orders, setOrders] = useState([])
    const [userdet, setUserdet] = useState({
      loogedin: {}
  })

    const [logistics,setLogistics] = useState([]);
    const [transportdata,setTransportdata] = useState({
      servicename:"",
      to:"",
      from:"",
      quantity:"",
      product:"",
      orderid:""
    })
  

    useEffect(()=>{
        handleuser();
    },[userdet.loogedin.available])

    useEffect(()=>{
      handleorders();
      // handlelogistics();
    },[])

    const handleuser =async()=>{
      const data = {
          username: sessionStorage.getItem('current-users'),
          mail: sessionStorage.getItem('current-users-mail')
      }
      
      try {
        const res = await fetch('https://ricelink-server.onrender.com/signinservices', {
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
      const res = await fetch('https://ricelink-server.onrender.com/orders', {
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

     const handlelogistics = async(e)=>{
      const allproviders = await fetch('https://ricelink-server.onrender.com/logistics',{headers:{accept:'application/json'}}) 
      const allproviders1 = await allproviders.json();
      
      setLogistics(allproviders1)
      setTransportdata({...transportdata,
         servicename: e.target.closest('.order').querySelector('.clientname').innerText,
         quantity: e.target.closest('.order').querySelector('.requirement').innerText,
         to: e.target.closest('.order').querySelector('.toaddr').innerText,
         product: e.target.closest('.order').querySelector('.product').innerText,
         orderid: e.target.closest('.order').querySelector('.orderid').innerText,
         from:userdet.loogedin.address
        })

        document.querySelector('.logistics').style.display = 'block'
     }
  
    

  const handleAcceptOrder = async (e) => {
       const data = {
        _id: e.target.closest('.order').querySelector('.orderid').innerText,
        quantity:parseInt( e.target.closest('.order').querySelector('.requirement').innerText)
        
        }
         
        const res = await fetch('https://ricelink-server.onrender.com/acceptorder', {
          method: 'post',
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data1 = await res.json();
        if(data1.message === 'Success'){
            e.target.closest('.status').innerText = 'Status: Accepted'
            e.target.closest('.status').style.color = 'green' 
        }else{
            alert('Error')
        }
    }

    const handleRejectOrder = async (e) => {
        const data = {
         _id: e.target.closest('.order').querySelector('.orderid').innerText
         }
         const res = await fetch('https://ricelink-server.onrender.com/rejectorder', {
          method: 'post',
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data1 = await res.json();
        if(data1.message === 'Success'){
            e.target.closest('.status').innerText = 'Status: Rejected'
            e.target.closest('.status').style.color = 'red' 
        }else{
            alert('Error')
        }
     }
    
     const handleonline= async(e)=>{
       const data = {
        _id: userdet.loogedin._id
       }

       const res = await fetch('https://ricelink-server.onrender.com/setonline', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data1 = await res.json();
      if(data1.message === 'Success'){
          document.getElementById('availability').innerText = 'Status: Online'
          // e.target.style.display = 'none'
          // document.getElementById('offline').style.display = 'block'
        setUserdet(prev=>({...prev,loogedin:{...prev.loogedin,available:true}}));

      }else{
          alert('Error')
      }
     }

     const handleoffline= async(e)=>{
      const data = {
        _id: userdet.loogedin._id
       }

       const res = await fetch('https://ricelink-server.onrender.com/setoffline', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data1 = await res.json();
      if(data1.message === 'Success'){
          document.getElementById('availability').innerText = 'Status: Offline'
          // e.target.style.display = 'none'
          // document.getElementById('online').style.display = 'block'
        setUserdet(prev=>({...prev,loogedin:{...prev.loogedin,available:false}}));

      }else{
          alert('Error')
      }
     }

     const handlestockedit = async(e)=>{
        const data = {
          _id:userdet.loogedin._id,
           stock: e.target.closest('.milldet').querySelector('input').value
        }
        const res = await fetch('https://ricelink-server.onrender.com/stockedit', {
          method: 'post',
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data1 = await res.json();
        if(data1.message === 'Success'){
          setUserdet(prev=>({...prev,loogedin:{...prev.loogedin,stock: e.target.closest('.milldet').querySelector('input').value}}));
          e.target.closest('.milldet').querySelector('.editarea').style.display = 'none'
  
        }else{
            alert('Error')
        }
     }
     
     const handlepriceedit = async(e)=>{
      const data = {
        _id:userdet.loogedin._id,
         price: e.target.closest('.milldet').querySelector('input').value
      }
      const res = await fetch('https://ricelink-server.onrender.com/priceedit', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data1 = await res.json();
      if(data1.message === 'Success'){
        setUserdet(prev=>({...prev,loogedin:{...prev.loogedin,price: e.target.closest('.milldet').querySelector('input').value}}));
    e.target.closest('.milldet').querySelector('.editarea').style.display = 'none'
      
      }else{
          alert('Error')
      }
   }
    
   const handleedit = (e)=>{
    if(e.target.innerText=='Edit'){e.target.innerText = 'Cancel'; e.target.style.backgroundColor = '#ffb1b1'}
    else{e.target.innerText = 'Edit';  e.target.style.backgroundColor = ''}
    e.target.closest('.milldet').querySelector('.editarea').classList.toggle('open')

   }

   const booklogistics = async(e)=>{
     const data = {
      servicename: transportdata.servicename,
      quantity:transportdata.quantity,
      product:transportdata.product,
      from:transportdata.from,
      to:transportdata.to,
      orderid:transportdata.orderid,
      total: parseInt(e.target.closest('.logisticdet').querySelector('.price').innerText) * parseInt(transportdata.quantity),
    status:'Pending' ,
    loginame:e.target.closest('.logisticdet').querySelector('.owner').innerText,
    logimail:e.target.closest('.logisticdet').querySelector('.logimail').innerText
    }

     const res = await fetch('https://ricelink-server.onrender.com/booklogistics', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data1 = await res.json();
    if(data1.message === 'Success'){
      document.getElementById('success').style.display = 'block'
      // document.getElementById('bidprice').value =''
     setTimeout(()=>{
         document.getElementById('success').style.display = 'none'
     },3000)
    
    }else{
      document.getElementById('failure').style.display = 'block'
     
      setTimeout(()=>{
        document.getElementById('failure').style.display = 'none'
    },3000)
    }

   }

   const handleclose = ()=>{
    document.querySelector('.logistics').style.display = 'none'

   }
   
  return (
    <>
      <Navbar/>

      <div className="heading">
            <h4>View All the Services You've Been Booked For.</h4>
            <h6>Stay updated and respond to customer requests quickly.</h6>
            
        </div>
       
        
         {/* <div className="note">Need to adjust the quote? Feel free to call the customer anytime to discuss details or budget!</div> */}
      
      {
          <div className="personaldata">
          <div className="milldet">Name: {userdet.loogedin.servicename}</div>
          <div className="milldet">Product Type: {userdet.loogedin.description}</div>
          <div className="milldet">Stock Available in Tonnes: {userdet.loogedin.stock} <button className='editbtns' onClick={handleedit}>Edit</button>
            <div className="editarea"><input type="Number" placeholder='Stock size'/> <button className='editbtns' onClick={handlestockedit}>Edit</button></div>
          </div>
          <div className="milldet">Price per Tonne: {userdet.loogedin.price} <button className='editbtns' onClick={handleedit}>Edit</button>
            <div className="editarea"> <input type="Number" placeholder='Stock size'/> <button className='editbtns' onClick={handlepriceedit}>Edit</button></div>
          </div>
          <div className="milldet" id='availability'>Current Status: {userdet.loogedin.available? "Online" : "Offline"} </div>
         <div className="available-buttons">
         <button id='online' style={{backgroundColor:userdet.loogedin.available?'#ffb1b1':'#95ff99'}} onClick={userdet.loogedin.available?handleoffline:handleonline}>{userdet.loogedin.available? "Go Offline" : "Go Online"} </button>
         {/* <button id='offline' onClick={handleoffline}>{userdet.loogedin.available? "Go Online" : "Go Offline"} </button> */}
         </div>
      </div>
      
      }
    

      <div className="orders">
           {
            orders && orders? orders.map(order=>{
                return(
                    <div className="order" key={order._id}>
                        <h3 className='orderid' style={{display:'none'}}>{order._id}</h3>
                        <h3>Product: {order.product}</h3>
                        <h3>Client Name: {order.clientname}</h3>
                        <h3>Client Phone No: {order.clientphone}</h3>
                        <h3>Client Mail: {order.clientmail}</h3>
                        <h3>Address: {order.address}</h3>
                        <h2>Requirement: {order.quantity} Tonnes</h2>
                        <h2 className="requirement" style={{display:'none'}}> {order.quantity}</h2>
                        <h2 className="clientname" style={{display:'none'}}> {order.clientname}</h2>
                        <h2 className="toaddr" style={{display:'none'}}> {order.address}</h2>
                        <h2 className="product" style={{display:'none'}}> {order.product}</h2>
                        <h3>Client's Budget: Rs.{order.bidprice} /- per Tonne</h3>
                        <h3 className='status' style={{backgroundColor:order.status=='Delivered'?'#abeaab':''}}>Status: {order.status}</h3>
                        <h3>Payment Status: {order.paymentstatus}</h3>
                        {order.status!='Delivered'?<h3>Logistics Status:{order.logistics}</h3>:<></>}
                        {order.status!='Delivered'?<h3>Code: {order.code}</h3>:<></>}
                      {
                        order.status === 'Pending' ?
                         (
                            <div className="buttons">
                            <button className='accept' onClick={handleAcceptOrder}>Accept Order</button>
                            <button className='reject' onClick={handleRejectOrder}>Reject Order</button>
                            </div>
                        ):(<></>)
                      }
                      {
                        order.logisticstatus==='Pending'?
                        (<button className='logisticsbtn' onClick={handlelogistics}>Notify Logistics</button>):(<></>)
                      }


<div className="logistics" style={{display:'none'}}>
     <div className="logisticshead">  Logistics Services Available   <button style={{backgroundColor:'#e68888'}} onClick={handleclose}>Close</button></div>
     <div className="success" id='success' style={{display:'none'}}>Order Successful.</div>
     <div className="success" id='failure' style={{display:'none'}}>Sorry, There occured a problem.</div>
   {
    logistics&&logistics? logistics.map(service=>{
        return(
          <div className="logisticdet">
            <div className="logidet"><h4>{service.servicename}</h4></div>
            <div className="logidet">Owner: {service.username}</div>
            <div className="logidet">Phone: {service.phone}</div>
            <div className="logidet">Mail: {service.mail}</div>
            <div className="logidet">District: {service.District}</div>
            <div className="logidet">Price per Tonne: Rs {service.price}/-</div>
            <div className="price" style={{display:'none'}}>{service.price}</div>
            <div className="owner" style={{display:'none'}}>{service.username}</div>
            <div className="logimail" style={{display:'none'}}>{service.mail}</div>
          <button onClick={booklogistics}>Book</button>
          </div>
        )
    }):<></>
   }
     </div>
                    </div>
                )
            }):<>No orders</>
           }
      </div>

   <Footer/>

    </>
  )
}

export default Serviceprovider
