import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import './profile.css';
import Footer from './footer';

const Profile = () => {
    const [userdet, setUserdet] = useState({ loogedin: {} });
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error handling

    useEffect(() => {
        handleuser();
        handlepayhistory();
    }, []);

    const handleuser = async () => {
        const data = {
            username: sessionStorage.getItem('current-users'),
            mail: sessionStorage.getItem('current-users-mail'),
        };

        try {
            let search = '';
            if (sessionStorage.getItem('user-role') === 'Customer') {
                search = 'loginusers';
            } else if (sessionStorage.getItem('user-role') === 'Provider') {
                search = 'signinservices';
            } else {
                search = 'transportservices';
            }

            const res = await fetch(`https://ricelink-server.onrender.com/${search}`, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const data1 = await res.json();
            setUserdet({ loogedin: data1.loggedin });
            console.log(data1);
            setLoading(false); // Once data is fetched, set loading to false
        } catch (err) {
            console.error('User not logged in or error fetching user', err);
            setError('Failed to load user details');
            setLoading(false);
        }
    };

    const handlepayhistory = async () => {
        const data = {
            clientmail: sessionStorage.getItem('current-users-mail'),
        };

        try {
            const res = await fetch('https://ricelink-server.onrender.com/mypayments', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const data1 = await res.json();
            setPayments(data1);
            console.log(data1);
        } catch (err) {
            console.error('Error fetching payment history', err);
            setError('Failed to load payment history');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <Navbar />
            <div className="heading">
                <h6>Edit your profile and stay connected with your services.</h6>
            </div>

            <div className="userdata">
                <h4>Personal Details</h4>
                <div className="user">Username: {userdet.loogedin.username || 'N/A'}</div>
                <div className="user">Phone: {userdet.loogedin.phone || 'N/A'}</div>
                <div className="user">District: {userdet.loogedin.District || 'N/A'}</div>
            </div>

            {/* Payment History (Uncomment if needed) */}
            {/* 
            <div className="paymenthistory">Payments History</div>
            <div className="payments">
                {payments && payments.length ? (
                    payments.map((payment, index) => (
                        <div key={index} className="paymentdet">
                            <div className="paydet">{payment.servicename} Rice Mill</div>
                            <div className="paydet">Receiver: {payment.reciever}</div>
                            <div className="paydet">Bank Name: {payment.bankname}</div>
                            <div className="paydet">Account No: {payment.accountno}</div>
                            <div className="paydet">{payment.amount}</div>
                        </div>
                    ))
                ) : (
                    <div>No Payments yet.</div>
                )}
            </div>
            */}

            <Footer />
        </>
    );
};

export default Profile;
