const mongoose = require('mongoose');

// Hardcoded MongoDB URI
mongoose.connect('mongodb+srv://Tarun2:ErHBBKbj21JAUBpu@cluster0.9ufjebs.mongodb.net/destinations?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB');
}).catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
});

// Shared options
const schemaOptions = {
    timestamps: true
};

const loginSchema = new mongoose.Schema({
    username: { type: String, required: true },
    phone: { type: String, required: true },
    mail: { type: String, required: true, match: /.+\@.+\..+/ },
    role: { type: String, required: true },
    password: { type: String, required: true },
    District: { type: String, required: true },
    address: { type: String, required: true }
}, schemaOptions);

const loginserviceSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    mail: { type: String, required: true, match: /.+\@.+\..+/ },
    role: { type: String, required: true },
    servicename: { type: String, required: true },
    District: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    phone: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    available: { type: Boolean, default: false, required: true }
}, schemaOptions);

const logintransportSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    mail: { type: String, required: true, match: /.+\@.+\..+/ },
    role: { type: String, required: true },
    servicename: { type: String, required: true },
    District: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    phone: { type: String, required: true },
    price: { type: String, required: true }
}, schemaOptions);

const bookingschema = new mongoose.Schema({
    address: { type: String, required: true },
    district: { type: String, required: true },
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    serviceusername: { type: String, required: true },
    servicemail: { type: String, required: true, match: /.+\@.+\..+/ },
    servicephone: { type: String, required: true },
    clientname: { type: String, required: true },
    clientphone: { type: String, required: true },
    clientmail: { type: String, required: true, match: /.+\@.+\..+/ },
    status: { type: String, required: true },
    bidprice: { type: Number, required: true },
    paymentstatus: { type: String, required: true },
    logistics: { type: String, required: true },
    code: { type: String, required: true }
}, schemaOptions);

const paymentschema = new mongoose.Schema({
    bankname: { type: String, required: true },
    accountno: { type: String, required: true },
    reciever: { type: String, required: true },
    clientmail: { type: String, required: true, match: /.+\@.+\..+/ },
    amount: { type: String, required: true },
    servicename: { type: String, required: true }
}, schemaOptions);

const booklogisticsschema = new mongoose.Schema({
    servicename: { type: String, required: true },
    quantity: { type: Number, required: true },
    product: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    total: { type: Number, required: true },
    orderid: { type: String, required: true },
    status: { type: String, required: true },
    loginame: { type: String, required: true },
    logimail: { type: String, required: true, match: /.+\@.+\..+/ }
}, schemaOptions);

// Exporting models
module.exports = {
    Login: mongoose.model('Login', loginSchema),
    LoginService: mongoose.model('LoginService', loginserviceSchema),
    TransportService: mongoose.model('TransportService', logintransportSchema),
    Booking: mongoose.model('Booking', bookingschema),
    Payment: mongoose.model('Payment', paymentschema),
    BookLogistics: mongoose.model('BookLogistics', booklogisticsschema)
};
