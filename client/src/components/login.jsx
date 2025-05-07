import React from 'react'
import './login.css'

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';








const Login = () => {

  let [user, setUser] = useState({
    username: "",
    mail: "",
    role: "",
    password: ""
  })

  let [signup, setSignup] = useState({
    username: "",
    phone: "",
    role: "",
    mail: "",
    password: "",
    District: "",
    address: "",
  })

  let [signupservices, setSignupservices] = useState({
    username: "",
    password: "",
    servicename: '',
    District: "",
    address: "",
    description: "",
    phone: "",
    mail: "",
    price: "",
    stock:""

  })

  let [signuptransport, setSignuptransport] = useState({
    username: "",
    password: "",
    servicename: '',
    District: "",
    address: "",
    description: "",
    phone: "",
    mail: "",
    price: ""

  })



  try {
    if (signup.role == "Customer") {
      document.getElementById('rolecont').style.display = 'none'
      document.getElementById('signupcont').style.display = 'flex'
      document.getElementById('signup_services').style.display = 'none'
      document.getElementById('signup_transport').style.display = 'none'


    }
    else if (signup.role == "Provider") {
      document.getElementById('rolecont').style.display = 'none'
      document.getElementById('signup_services').style.display = 'flex'
      document.getElementById('signupcont').style.display = 'none'
      document.getElementById('signup_transport').style.display = 'none'


    }
    else if (signup.role == "Transport") {
      document.getElementById('rolecont').style.display = 'none'
      document.getElementById('signup_transport').style.display = 'flex'
      document.getElementById('signupcont').style.display = 'none'
      document.getElementById('signup_services').style.display = 'none'


    }
    else { }
  }
  catch (e) { }

  const [logins, setLogins] = useState([])
  const [newuser, setNewuser] = useState(true)
  const [showinp, setShowinp] = useState(false);

  const followinglist2 = []




  if (showinp == true) {
    document.getElementById('input-cont').style.display = 'flex'
    document.getElementById('loading').style.display = 'none'
    document.getElementById('notfound').style.display = 'none'
    // clearInterval(interval)
  }



  const handlesignup_anim = () => {
    document.getElementById("input-cont").style.flexDirection = "row"
    document.getElementById('logincont').style.display = "none"
    document.getElementById('rolecont').style.display = "flex"
    // document.getElementById('signupcont').style.display = "flex"
  }

  const handlesignin_anim = () => {
    document.getElementById("input-cont").style.flexDirection = "row"
    document.getElementById('logincont').style.display = "flex"
    document.getElementById('rolecont').style.display = "none"
    document.getElementById('signupcont').style.display = "none"
    document.getElementById('signup_services').style.display = 'none'
    setSignup({ ...signup, role: "" })

  }

  let name; let value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value })

    document.getElementById('wrongpass').style.display = 'none'
    document.getElementById('loginbtn').innerText = 'Log In'
    document.getElementById('loginbtn').style.backgroundColor = '#00BFFF'
    document.getElementById('loginbtn').style.zIndex = '1'


  }


  const handleSignup = (e) => {
    name = e.target.name;
    value = e.target.value;
    setSignup({ ...signup, [name]: value })

    document.getElementById('signupbtn').style.zIndex = '0'
    document.getElementById('signupbtn').style.backgroundColor = '#00BFFF'
    document.getElementById('signupbtn').innerText = 'Sign Up'
    document.getElementById('wrongnewpass').style.display = 'none'
  }

  const handleSignupservices = (e) => {
    name = e.target.name;
    value = e.target.value;
    setSignupservices({ ...signupservices, [name]: value })
    document.getElementById('signupbtn').style.zIndex = '0'
  }

  const handleSignuptransport = (e) => {
    name = e.target.name;
    value = e.target.value;
    setSignuptransport({ ...signuptransport, [name]: value })
    document.getElementById('signupbtn').style.zIndex = '0'
  }


  const submit = async () => {

    if (user.username == '' || user.password == '') {
      document.getElementById('username').style.border = '1px solid red'
      document.getElementById('password').style.border = '1px solid red'
    }
    else {

      document.getElementById('loginbtn').innerText = 'Log In ...'
      document.getElementById('loginbtn').style.backgroundColor = '#00BFFF'
      document.getElementById('loginbtn').style.zIndex = '-1'


      const userdet = {
        username: user.username,
        mail: user.mail,
        role: user.role,
        password: user.password
      }
      console.log(userdet)
      let endpoint = '';

      if (userdet.role === 'Customer') {
        endpoint = 'login';
      } else if (userdet.role === 'Provider') {
        endpoint = 'loginservices';
      } else if (userdet.role === 'Transport') {
        endpoint = 'logintransport';
      }
      
      const alllogin = fetch(`https://ricelink-server.onrender.com/${endpoint}`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(userdet)
      });
      
      alllogin.then(response => response.json()).then(data => {
        console.log(data);
      
        if (data.loggedin != null && data.loggedin.mail === user.mail) {
          console.log('good');
          sessionStorage.setItem('isloggedin', true);
          sessionStorage.setItem('current-users', data.loggedin.username);
          sessionStorage.setItem('current-users-mail', data.loggedin.mail);
          sessionStorage.setItem('user-role', data.loggedin.role);
      
          document.getElementById('input-cont').style.display = 'none';
          document.getElementById('logo').style.display = 'none';
      
          if (data.loggedin.role === 'Customer') {
            document.getElementById('welcomebackcont').style.display = 'flex';
          } else if (data.loggedin.role === 'Provider') {
            document.getElementById('welcomebackprovidercont').style.display = 'flex';
          } else if (data.loggedin.role === 'Transport') {
            document.getElementById('welcomebacktransportcont').style.display = 'flex';
          }
      
        } else {
          document.getElementById('wrongpass').style.display = 'initial';
          document.getElementById('loginbtn').innerText = 'Log In';
          document.getElementById('loginbtn').style.backgroundColor = '#00BFFF';
          document.getElementById('loginbtn').style.zIndex = '1';
        }
      });
      
    }
  }

  const submitSignup = async () => {
    document.getElementById('signupbtn').style.zIndex = '-1'
    document.getElementById('signupbtn').style.backgroundColor = '#00BFFF'
    document.getElementById('signupbtn').innerText = 'Sign Up...'

    if (signup.username == '' || signup.password == '') {
      document.getElementById('username1').style.border = '1px solid red'
      document.getElementById('password1').style.border = '1px solid red'
    }
    else if (signup.mail == '') {
      document.getElementById('mail1').style.border = '1px solid red'
    }
    else {

      const signupreq = await fetch('https://ricelink-server.onrender.com/signup', { method: 'post', headers: { "Content-Type": "application/json" }, credentials: 'include', body: JSON.stringify(signup) })

      const resdata = await signupreq.json();
      console.log(resdata)
      if (resdata.message == 'Success') {
        sessionStorage.setItem('isloggedin', true)
        sessionStorage.setItem('current-users', signup.username)
        sessionStorage.setItem('current-users-mail',signup.mail)
        sessionStorage.setItem('user-role', signup.role)
        document.getElementById('signupcont').style.display = 'none'
        document.getElementById('rolecont').style.display = 'none'
        document.getElementById('logo').style.display = 'none'
        document.getElementById('input-cont').style.display = 'none'
        document.getElementById('newusercont').style.display = 'flex'
      }
    }
  }

  const submitserviceSignup = async () => {
    document.getElementById('signupbtn').style.zIndex = '-1'
    document.getElementById('signupbtn').style.backgroundColor = '#00BFFF'
    document.getElementById('signupbtn').innerText = 'Sign Up...'

    const data = {
      username: signupservices.username,
      password: signupservices.password,
      mail: signupservices.mail,
      servicename: signupservices.servicename,
      // city: signupservices.city,
      address: signupservices.address,
      description: signupservices.description,
      phone: signupservices.phone,
      role: signup.role,
      price: signupservices.price,
      District: signupservices.District,
      stock:signupservices.stock,

    }
    const signupservice = await fetch(`https://ricelink-server.onrender.com/signupservice`, { method: 'post', headers: { "Content-Type": "application/json" }, credentials: 'include', body: JSON.stringify(data) })
    const resdata = await signupservice.json();

    if (resdata.message == 'Success') {
      sessionStorage.setItem('user-role', data.loggedin.role)
      sessionStorage.setItem('isloggedin', true)
      sessionStorage.setItem('current-users', signupservices.username)
      sessionStorage.setItem('current-users-mail', signupservices.mail)
      sessionStorage.setItem('current-users-servicename', signupservices.servicename);
      document.querySelector('.signup_services').style.display = 'none'
      document.getElementById('newusercont').style.display = 'flex'
      document.getElementById('logo').style.display = 'none'
      document.getElementById('input-cont').style.display = 'none'
    }
  }


  
  const submittransportSignup = async () => {
    document.getElementById('signupbtn').style.zIndex = '-1'
    document.getElementById('signupbtn').style.backgroundColor = '#00BFFF'
    document.getElementById('signupbtn').innerText = 'Sign Up...'

    const data = {
      username: signuptransport.username,
      password: signuptransport.password,
      mail: signuptransport.mail,
      servicename: signuptransport.servicename,
      // city: signuptransport.city,
      address: signuptransport.address,
      description: signuptransport.description,
      phone: signuptransport.phone,
      role: signup.role,
      price: signuptransport.price,
      District: signuptransport.District
    }
    const signupservice = await fetch(`https://ricelink-server.onrender.com/signuptransport`, { method: 'post', headers: { "Content-Type": "application/json" }, credentials: 'include', body: JSON.stringify(data) })
    const resdata = await signupservice.json();

    if (resdata.message == 'Success') {
      sessionStorage.setItem('user-role', data.loggedin.role)
      sessionStorage.setItem('isloggedin', true)
      sessionStorage.setItem('current-users', signupservices.username)
      sessionStorage.setItem('current-users-mail', signupservices.mail)
      sessionStorage.setItem('current-users-servicename', signupservices.servicename);
      document.querySelector('.signup_services').style.display = 'none'
      document.getElementById('newusercont').style.display = 'flex'
      document.getElementById('logo').style.display = 'none'
      document.getElementById('input-cont').style.display = 'none'
    }
  }

  let loadingstatements = ['Just a moment... Excellence can’t be rushed!',
    'Grabbing the magic wand... Sparkles loading!',
    'Almost there! Great experiences are just seconds away.',
    'We’re cooking up something great—almost done baking!',
    'Loading... This is a great time to take a deep breath!']

  return (
    <>

      <div className="cont">

        <div className="logo" id='logo'>COMMUNE</div>
        <div className="loading" id='loading'>


          {/* <iframe id='loadingframe' src="https://lottie.host/embed/0779841c-24c8-4da4-b4bb-8b366930a3af/z6EltEHTOI.lottie" frameborder="0"></iframe> */}

          <p className='loadingstatement' id='loadingstatement'>{loadingstatements[Math.floor(Math.random() * 5)]}</p>
          <p className='loadingstatement' id='notfound' style={{ display: 'none' }}>We're sorry for the inconvenience 😔</p>
        </div>

        <div className="input-cont" id='input-cont'>

          { /* login form */}
          <div className="logincont" id='logincont'> Sign In
            <div id='wrongpass' className='wrongpass' style={{ display: 'none' }}>Incorrect username or password.<br /> New to Commune? Please sign up!</div>



            <input type="text" name='username' value={user.username} placeholder='Username' id='username' onChange={handleChange} />
            <input type="text" name='password' value={user.password} placeholder='password' onChange={handleChange} />
            <input type="text" name='mail' value={user.mail} placeholder='E-mail' id='password' onChange={handleChange} />


            <div className="rolecont" id='rolecontsignin'>
              <div className="selectdp-head">Log In As?</div>
              <input type="radio" name='role' value="Customer" id='rolec' onChange={handleChange} />
              <span>Customer</span>
              <input type="radio" name='role' value="Provider" id='rolep' onChange={handleChange} />
              <span>Provider</span>
              <input type="radio" name='role' value="Transport" id='rolet' onChange={handleChange} />
              <span>Transport</span>
            </div>

            <div className='signbtn-holder'>
              <button type='submit' className='submit-btn' id='loginbtn' onClick={() => { submit() }}>Log In</button>

              <button className='submit-btn' onClick={handlesignup_anim}>Sign Up</button>
            </div>

          </div>

          {/* //role selection at signup */}

          <div className="rolecont" id='rolecont'>
            <div className="selectdp-head">Who are you?</div>
            <input type="radio" name='role' value="Customer" id='rolec1' onChange={handleSignup} />
            <span>Customer</span>
            <input type="radio" name='role' value="Provider" id='rolep1' onChange={handleSignup} />
            <span>Provider</span>
            <input type="radio" name='role' value="Transport" id='rolet1' onChange={handleSignup} />
            <span>Transport</span>
          </div>


          {/* // signup for customer */}

          <div className="signupcont" id='signupcont'> Sign Up
            <div className='wrongpass' id='wrongnewpass' style={{ display: 'none' }}>This password is already taken.<br /> Please think of a new one. </div>
            <input type="text" name='username' id='username1' placeholder='Username' value={signup.username} onChange={handleSignup} />
            <input type="text" name='password' id='password1' placeholder='password' value={signup.password} onChange={handleSignup} />
            <input type="text" name='phone' id='phone1' placeholder='Contact No.' value={signup.phone} onChange={handleSignup} />
            <input type="text" name='mail' id='mail1' placeholder='E-mail' value={signup.mail} onChange={handleSignup} />
            <input type="text" name='District' id='District1' placeholder='District' value={signup.District} onChange={handleSignup} />
            <input type="text" name='address' id='address1' placeholder='Address' value={signup.address} onChange={handleSignup} />

            <div className='signbtn-holder'>
              <button type='submit' className='submit-btn' onClick={handlesignin_anim}>Log In</button>
              <button type='submit' id='signupbtn' className='submit-btn' onClick={() => { submitSignup() }}>Sign up</button>
            </div>
          </div>



          {/* // signup for service provider */}

          <div className="signup_services" id='signup_services'> Sign Up
            <div className='wrongpass' id='wrongnewpass' style={{ display: 'none' }}>This password is already taken.<br /> Please think of a new one. </div>

            <div className="personaldet">
              <input type="text" name='username' id='usernames' placeholder='Username' value={signupservices.username} onChange={handleSignupservices} />
              <input type="text" name='password' id='passwords' placeholder='Password' value={signupservices.password} onChange={handleSignupservices} />
              <input type="number" name='phone' id='phones' placeholder='Mobile number' value={signupservices.phone} onChange={handleSignupservices} />
              <input type="text" name='mail' id='mails' placeholder='E-mail' value={signupservices.mail} onChange={handleSignupservices} />

            </div>

            <input type="text" name='servicename' id='servicenames' placeholder='Your service name / Organization Name' value={signupservices.servicename} onChange={handleSignupservices} />
            <input type="text" name='description' id='descriptions' placeholder='Product Type' value={signupservices.description} onChange={handleSignupservices} />
            <input type="number" name='price' id='prices' placeholder='Rs/Ton' value={signupservices.price} onChange={handleSignupservices} />
           <input type="number"  name='stock' id='stock' placeholder='Stock available in TONS' value={signupservices.stock} onChange={handleSignupservices}/>

            <div className="address">
              <input type="text" name='District' id='districts' placeholder='District' value={signupservices.District} onChange={handleSignupservices} />
              <input type="text" name='address' id='addresss' placeholder='address' value={signupservices.address} onChange={handleSignupservices} />

            </div>

            <div className='signbtn-holder'>
              <button type='submit' className='submit-btn' onClick={handlesignin_anim}>Log In</button>

              <button type='submit' id='signupbtn' className='submit-btn' onClick={() => { submitserviceSignup() }}>Sign up</button>
            </div>
          </div>

        </div>
      </div>
    
    {/* signup for transport services */}

    <div className="signup_services" id='signup_transport'> Sign Up
            <div className='wrongpass' id='wrongnewpass' style={{ display: 'none' }}>This password is already taken.<br /> Please think of a new one. </div>

            <div className="personaldet">
              <input type="text" name='username' id='usernamet' placeholder='Username' value={signuptransport.username} onChange={handleSignuptransport} />
              <input type="text" name='password' id='passwordt' placeholder='Password' value={signuptransport.password} onChange={handleSignuptransport} />
              <input type="number" name='phone' id='phonet' placeholder='Mobile number' value={signuptransport.phone} onChange={handleSignuptransport} />
              <input type="text" name='mail' id='mailt' placeholder='E-mail' value={signuptransport.mail} onChange={handleSignuptransport} />

            </div>

            <input type="text" name='servicename' id='servicenamet' placeholder='Your service name / Organization Name' value={signuptransport.servicename} onChange={handleSignuptransport} />
            <input type="text" name='description' id='descriptiont' placeholder='Description' value={signuptransport.description} onChange={handleSignuptransport} />
            <input type="number" name='price' id='pricet' placeholder='Rs/Ton' value={signuptransport.price} onChange={handleSignuptransport} />

            <div className="address">
              <input type="text" name='District' id='districtt' placeholder='District' value={signuptransport.District} onChange={handleSignuptransport} />
              <input type="text" name='address' id='addresst' placeholder='address' value={signuptransport.address} onChange={handleSignuptransport} />

            </div>

            <div className='signbtn-holder'>
              <button type='submit' className='submit-btn' onClick={handlesignin_anim}>Log In</button>

              <button type='submit' id='signupbtn' className='submit-btn' onClick={() => { submittransportSignup() }}>Sign up</button>
            </div>
          </div>

      


      {/* // welcome back animation */}
      <div id='welcomebackcont'>
        {/* <div className="celebration1">
          <iframe id='celebration' src="https://lottie.host/embed/503bed59-c29d-46eb-935d-a996c60858a3/geOsLMBMTf.lottie" frameborder="0"></iframe>
        </div> */}
        <p className='welcomeback'>Welcome Back {user.username} !</p>
        <button className='navbtn1'  ><Link to={'/'}>Home</Link></button>
      </div>


      {/* // welcome back provider animation */}

      <div id='welcomebackprovidercont'>
        {/* <div className="celebration1">
          <iframe id='celebration' src="https://lottie.host/embed/503bed59-c29d-46eb-935d-a996c60858a3/geOsLMBMTf.lottie" frameborder="0"></iframe>
        </div> */}
        <p className='welcomeback'>Welcome Back {user.username} !</p>
        <button className='navbtn1'  ><Link to={'/serviceprovider'}>Home</Link></button>
      </div>

      <div id='welcomebacktransportcont'>
        {/* <div className="celebration1">
          <iframe id='celebration' src="https://lottie.host/embed/503bed59-c29d-46eb-935d-a996c60858a3/geOsLMBMTf.lottie" frameborder="0"></iframe>
        </div> */}
        <p className='welcomeback'>Welcome Back {user.username} !</p>
        <button className='navbtn1'  ><Link to={'/transport'}>Home</Link></button>
      </div>

      {/* // new user animation */}
      <div id='newusercont'>
        {/* <div className="celebration">
          <iframe id='celebration' src="https://lottie.host/embed/d7852d0f-dbde-43f2-9223-9233d839e93f/9i7ZLGOPeC.lottie" frameborder="0"></iframe>
        </div> */}
        <p className='welcomeback'>
          Welcome to Grain Works! 🎉 <br />
          We're so glad you've joined us.</p>
        <button className='navbtn1'  ><Link to={'/'}>Home</Link></button>
      </div>

    </>
  )
}

export default Login
