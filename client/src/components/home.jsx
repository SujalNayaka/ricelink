import React, { useEffect, useState } from 'react';
import './home.css';
import Navbar from './navbar';
import Footer from './footer';

const Home = () => {
  const [search, setSearch] = useState('');
  const [searchquant, setSearchquant] = useState('');
  const [allproviders, setAllproviders] = useState([]);
  const [userdet, setUserdet] = useState({
    loogedin: {}
  });

  useEffect(() => {
    if (sessionStorage.getItem('isloggedin') === 'true') {
      handlefetchproviders();
      handleuser();
    } else {
      document.getElementById('signinwarn').style.display = 'block';
    }
  }, []);

  const handleuser = async () => {
    const data = {
      username: sessionStorage.getItem('current-users'),
      mail: sessionStorage.getItem('current-users-mail')
    };
    
    try {
      const res = await fetch('https://ricelink-server.onrender.com/loginusers', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const data1 = await res.json();
      setUserdet({ loogedin: data1.loggedin });
      console.log(data1);
    } catch (err) {
      console.error("Error fetching user", err);
    }
  };

  const handlefetchproviders = async () => {
    const allproviders = await fetch('https://ricelink-server.onrender.com/allproviders', { headers: { accept: 'application/json' } });
    const allproviders1 = await allproviders.json();
    setAllproviders(allproviders1);
  };

  const handlebid = async (e) => {
    if (searchquant) {
      const data = {
        address: userdet.loogedin.address,
        district: e.target.closest('.milldatas').querySelector('.district').innerText,
        product: search || e.target.closest('.milldatas').querySelector('.productname').innerText,
        quantity: searchquant,
        serviceusername: e.target.closest('.milldatas').querySelector('.servicename').innerText,
        servicemail: e.target.closest('.milldatas').querySelector('.servicemail').innerText,
        servicephone: e.target.closest('.milldatas').querySelector('.servicephone').innerText,
        clientname: userdet.loogedin.username,
        clientphone: userdet.loogedin.phone || 'Contact details not provided',
        clientmail: userdet.loogedin.mail,
        status: parseInt(e.target.closest('.milldatas').querySelector('.serviceprice').innerText) <= parseInt(document.getElementById('bidprice').value) ? 'Auto Accepted' : 'Pending',
        bidprice: document.getElementById('bidprice').value,
        paymentstatus: 'Pending',
        logistics: 'Pending',
        code: 'No code'
      };

      const res = await fetch('https://ricelink-server.onrender.com/bookings', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data1 = await res.json();
      if (data1.message === 'Success') {
        document.getElementById('success').style.display = 'block';
        document.getElementById('bidprice').value = '';
        setTimeout(() => {
          document.getElementById('success').style.display = 'none';
        }, 3000);
      } else {
        document.getElementById('failure').style.display = 'block';
        document.getElementById('bidprice').value = '';
        setTimeout(() => {
          document.getElementById('failure').style.display = 'none';
        }, 3000);
      }
    } else {
      document.getElementById('searcquantity').style.border = '1px solid red';
    }
  };

  return (
    <>
      <Navbar />
      <div className="success" id="success" style={{ display: 'none' }}>Bid Successful.</div>
      <div className="success" id="failure" style={{ display: 'none' }}>Sorry, There occurred a problem.</div>
      <div className="success" id="signinwarn" style={{ display: 'none' }}>Please sign in to use the service.</div>

      <div className="heading">
        <h4>Your Trusted Rice Mill Network</h4>
        <h6>One grain at a time.</h6>
      </div>

      <div className="search">
        <input placeholder="Search Product..." type="text" id="searchinput" onChange={(e) => { setSearch(e.target.value) }} />
        <input placeholder="Enter Quantity (in Tonnes)" type="Number" id="searcquantity" onChange={(e) => { setSearchquant(e.target.value) }} />
      </div>

      <div className="note">Rice Mill Service Providers.</div>

      {allproviders && allproviders
        .filter((item) => {
          const matchesSearch = search.toLowerCase() === '' || item.description.toLowerCase().includes(search.toLowerCase());
          const matchesQuantity = searchquant === '' || item.stock >= parseInt(searchquant);
          return matchesSearch && matchesQuantity;
        })
        .map(provider => (
          <div className="milldatas" key={provider.username}>
            <div className="milldetails">
              <div className="milldata"><h4>Name: {provider.servicename}</h4></div>
              <div className="district" style={{ display: 'none' }}>{provider.District}</div>
              <div className="servicename" style={{ display: 'none' }}>{provider.username}</div>
              <div className="servicemail" style={{ display: 'none' }}>{provider.mail}</div>
              <div className="serviceprice" style={{ display: 'none' }}>{provider.price}</div>
              <div className="servicephone" style={{ display: 'none' }}>{provider.phone}</div>
              <div className="productname" style={{ display: 'none' }}>{provider.description}</div>
              <div className="milldata">Product: {provider.description}</div>
              <div className="milldata">Price: Rs {provider.price + (provider.price * 0.05)}/- per Tonne</div>
              <div className="milldata">Quantity: {provider.stock} Tonnes</div>
            </div>

            <div className="bidding">
              Bid Price: <input type="Number" id="bidprice" placeholder="Rupees per Tonne" />
              <button onClick={handlebid}>Bid</button>
            </div>
          </div>
        ))
      }

      <Footer />
    </>
  );
};

export default Home;
