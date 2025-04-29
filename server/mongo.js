const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Tarun2:ErHBBKbj21JAUBpu@cluster0.9ufjebs.mongodb.net/destinations?retryWrites=true&w=majority&appName=Cluster0/').then(() => {
    console.log('Connected to local MongoDB');
}).catch(() => {
    console.log("Error connecting to local MongoDB");
});


const loginSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    mail:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

    District:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },

})

const loginserviceSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mail:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    servicename:{
        type:String,
        required:true
    },
    District:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    available:{
        type:Boolean,
        default:false,
        required:true
    }
    
})

const logintransportSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mail:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    servicename:{
        type:String,
        required:true
    },
    District:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    }
    
})

const bookingschema = new mongoose.Schema({
    address:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    product:{
        type:String,
        required:true
    },

    quantity:{
        type:Number,
        required:true
    },

    serviceusername:{
        type:String,
        required:true
    },
    servicemail:{
        type:String,
        required:true
    },
    servicephone:{
        type:String,
        required:true
    },
    clientname:{
        type:String,
        required:true
    },
    clientphone:{
        type:String,
        required:true
    },
    clientmail:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    bidprice:{
        type:Number,
        required:true
    },
    paymentstatus:{
        type:String,
        required:true
    },
    logistics:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    }
})

const paymentschema = new mongoose.Schema({
    bankname:{
        type:String,
        required:true
    },
    accountno:{
        type:String,
        required:true
    },
    reciever:{
        type:String,
        required:true
    },
    clientmail:{
        type:String,
        required:true
    },
    amount:{
        type:String,
        required:true
    },
    servicename:{
        type:String,
        required:true
    }
})

const booklogisticsschema = new mongoose.Schema({
     servicename:{
        type:String,
        required:true
     },
     quantity:{
        type:Number,
        required:true
     },
     product:{
        type:String,
        required:true
     },
     from:{
        type:String,
        required:true
     },
     to:{
        type:String,
        required:true
     },
     total:{
        type:Number,
        required:true
     },
     orderid:{
        type: String,
        required:true
     },
     status:{
        type: String,
        required:true
     },
     loginame:{
        type: String,
        required:true
     },
     logimail:{
        type: String,
        required:true
     }
    })



const login = mongoose.model('logins', loginSchema)
const loginservices = mongoose.model('loginservices', loginserviceSchema)
const transportservices = mongoose.model('transportservices', logintransportSchema) 
const booking = mongoose.model('bookings', bookingschema)
const payment = mongoose.model('payment',paymentschema)
const booklogistics = mongoose.model('booklogistics', booklogisticsschema)

module.exports = {login,loginservices,transportservices,booking,payment,booklogistics}

