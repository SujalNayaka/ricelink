const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const port = 5004;

const login = require('./mongo');
const loginservices = require('./mongo');
const transportservices = require('./mongo');
const booking = require('./mongo');
const payment = require('./mongo');
const booklogistics = require('./mongo');

const JWT_SECRET = process.env.JWT_SECRET || 'tarun@!%$(}<>#+-*/&%';

app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:8000', 'https://ricelink.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
}));
app.use(bodyParser.json());

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// Utility function to handle user signup and login logic
const handleSignup = async (req, res, userType, model) => {
    const { username, password, mail, role, ...otherData } = req.body;
    try {
        const hashedPass = await bcrypt.hash(password, 10);
        let newUser = {
            username,
            password: hashedPass,
            mail,
            role,
            ...otherData,
        };

        await model.insertMany(newUser);

        const token = jwt.sign(
            { username: newUser.username, mail: mail },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 60 * 60 * 1000,
        });

        res.json({ message: 'Success', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Login routes
app.post('/login', async (req, res) => {
    const { username, mail, password } = req.body;
    try {
        const loggedin = await login.login.findOne({ username, mail });
        if (loggedin && await bcrypt.compare(password, loggedin.password)) {
            const token = jwt.sign({ username, mail }, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                maxAge: 60 * 60 * 1000,
            });
            return res.json({ loggedin });
        }
        res.status(400).json({ message: 'Invalid credentials' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Services and Transport Login
const loginServiceHandler = async (req, res, model) => {
    const { username, mail, password } = req.body;
    try {
        const loggedin = await model.findOne({ username, mail });
        if (loggedin && await bcrypt.compare(password, loggedin.password)) {
            const token = jwt.sign({ username, mail }, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                maxAge: 60 * 60 * 1000,
            });
            return res.json({ loggedin });
        }
        res.status(400).json({ message: 'Invalid credentials' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

app.post('/loginservices', (req, res) => loginServiceHandler(req, res, loginservices.loginservices));
app.post('/logintransport', (req, res) => loginServiceHandler(req, res, transportservices.transportservices));

// Signup routes
app.post('/signup', (req, res) => handleSignup(req, res, 'user', login.login));
app.post('/signupservice', (req, res) => handleSignup(req, res, 'service', loginservices.loginservices));
app.post('/signuptransport', (req, res) => handleSignup(req, res, 'transport', transportservices.transportservices));

// Update stock or price
const updateField = async (req, res, fieldName, model) => {
    const { _id, [fieldName]: value } = req.body;
    try {
        const update = await model.updateOne({ _id }, { $set: { [fieldName]: value } });
        if (update.modifiedCount > 0) {
            res.status(200).json({ message: 'Success' });
        } else {
            res.status(400).json({ message: 'Error' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

app.post('/stockedit', (req, res) => updateField(req, res, 'stock', loginservices.loginservices));
app.post('/priceedit', (req, res) => updateField(req, res, 'price', loginservices.loginservices));

// Order handling
app.post('/bookings', async (req, res) => {
    const data = req.body;
    try {
        const booked = await booking.booking.insertMany(data);
        if (data.status.includes('Accepted')) {
            await loginservices.loginservices.updateOne({ mail: data.servicemail }, { $inc: { stock: -data.quantity } });
        }
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Payments
app.post('/payment', async (req, res) => {
    const data = req.body;
    try {
        await payment.payment.insertMany(data);
        await booking.booking.updateOne({ _id: data._id }, { $set: { paymentstatus: 'Paid' } });
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Orders and logistics
app.post('/logisticorders', async (req, res) => {
    const { serviceusername, servicemail } = req.body;
    try {
        const orders = await booklogistics.booklogistics.find({ loginame: serviceusername, logimail: servicemail });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Accept/Reject Orders
const updateOrderStatus = async (req, res, status) => {
    const { _id, currentid, regno, currentlocation } = req.body;
    const code = regno.split('').reverse().join('');
    try {
        const accept = await booking.booking.updateOne({ _id }, { $set: { logistics: `${regno},${currentlocation}`, code: `Share this code with our Driver ${code}` } });
        const update2 = await booklogistics.booklogistics.updateOne({ _id: currentid }, { $set: { status } });
        if (accept.modifiedCount > 0 && update2.modifiedCount > 0) {
            res.status(200).json({ message: 'Success' });
        } else {
            res.status(400).json({ message: 'Error' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

app.post('/acceptorder', (req, res) => updateOrderStatus(req, res, 'Accepted'));
app.post('/rejectorder', (req, res) => updateOrderStatus(req, res, 'Rejected'));
app.post('/recievedorder', (req, res) => updateOrderStatus(req, res, 'Delivered'));

// Set user status (online/offline)
const setStatus = async (req, res, status) => {
    const { _id } = req.body;
    try {
        const update = await loginservices.loginservices.updateOne({ _id }, { $set: { available: status } });
        if (update.modifiedCount > 0) {
            res.status(200).json({ message: 'Success' });
        } else {
            res.status(400).json({ message: 'Error' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

app.post('/setonline', (req, res) => setStatus(req, res, true));
app.post('/setoffline', (req, res) => setStatus(req, res, false));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
