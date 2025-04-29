const express = require ('express');
const app = express();
const cors = require ('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const port = 5004;
const JWT_SECRET = "tarun@!%$(}<>#+-*/&%";

const login = require('./mongo')
const loginservices = require('./mongo')
const transportservices = require('./mongo')
const booking = require('./mongo')
const payment = require('./mongo')
const booklogistics = require('./mongo')



const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
}));
app.use(bodyParser.json())

const server = app.listen(port,() =>{
    console.log(`listening on port ${port}`)
})


app.post('/login', async(req,res)=>{
    const {username, mail ,password} = req.body;
    
    const loggedin = await login.login.findOne({username:username ,mail:mail})
   // console.log(loggedin)
    if(await bcrypt.compare(password, loggedin.password)){
     const token = jwt.sign(
       {username: username,mail:mail},
       JWT_SECRET,
       { expiresIn: '1h' }
     );
      res.cookie('token', token, {
       httpOnly: true,      
       secure: false,       
       sameSite: 'Lax',
       maxAge: 60 * 60 * 1000 
     })
     return res.json({loggedin:loggedin})
    
    }
   })

   app.post('/loginservices', async(req,res)=>{
    const {username, mail ,password} = req.body;
    
    const loggedin = await loginservices.loginservices.findOne({username:username ,mail:mail})
  
    if(await bcrypt.compare(password, loggedin.password)){
      console.log(loggedin.password)
      const token = jwt.sign(
        {username: username,mail:mail},
        JWT_SECRET,
        { expiresIn: '1h' }
      );
       res.cookie('token', token, {
        httpOnly: true,      
        secure: false,       
        sameSite: 'Lax',
        maxAge: 60 * 60 * 1000 
      })
      res.json({loggedin:loggedin})
     }
  
})

app.post('/logintransport', async(req,res)=>{
  const {username, mail ,password} = req.body;
  
  const loggedin = await transportservices.transportservices.findOne({username:username ,mail:mail})

  if(await bcrypt.compare(password, loggedin.password)){
    console.log(loggedin.password)
    const token = jwt.sign(
      {username: username,mail:mail},
      JWT_SECRET,
      { expiresIn: '1h' }
    );
     res.cookie('token', token, {
      httpOnly: true,      
      secure: false,       
      sameSite: 'Lax',
      maxAge: 60 * 60 * 1000 
    })
    res.json({loggedin:loggedin})
   }

})

app.get('/allproviders', async(req,res)=>{
  const providers = await loginservices.loginservices.find();
  res.json(providers)
})

app.get('/logistics', async(req,res)=>{
  const providers = await transportservices.transportservices.find();
  res.json(providers)
})

app.post('/signinservices',  async (req, res) => {
  const { username, mail } = req.body;    
  const loggedin = await loginservices.loginservices.findOne({
    username: username,
    mail: mail
  });
//  console.log(loggedin)
  res.json({ loggedin: loggedin });
});

app.post('/transportservices',  async (req, res) => {
  const { username, mail } = req.body;    
  const loggedin = await transportservices.transportservices.findOne({
    username: username,
    mail: mail
  });
//  console.log(loggedin)
  res.json({ loggedin: loggedin });
});

app.post('/loginusers',  async (req, res) => {
  const { username, mail } = req.body;    
  const loggedin = await login.login.findOne({
    username: username,
    mail: mail
  });
//  console.log(loggedin)
  res.json({ loggedin: loggedin });
});

   app.post('/signup', async (req, res) => {
   
    const { username, phone, mail,role,password,District,address } = req.body;
    const hashedpass =  await bcrypt.hash(password, 10)
    try {
        let newUser = {
            username,
            phone,
            mail,
            role,
password: hashedpass ,
            District,
            address
 };
        await login.login.insertMany(newUser)

        const token = jwt.sign(
          {username: newUser.username, mail:mail},
          JWT_SECRET,
          { expiresIn: '1h' }
        );
        res
        .cookie('token', token, {
          httpOnly: true,      
          secure: false,       
          sameSite: 'Lax',
          maxAge: 60 * 60 * 1000 
        })
        res.json({ message: 'Success' ,token});
    } catch (error) {
        console.log(error);
    }

})

app.post('/signupservice', async (req, res) => {
    const { username, password, mail,role, servicename, District, address, description, phone, stock,price } = req.body;
    const hashedpass = await bcrypt.hash(password, 10);
    
        let newService ={
            username,
            password: hashedpass,
            mail,
            role,
            servicename,
            District,
            address,
            description,
            phone,
            price,
            stock
        };
        await loginservices.loginservices.insertMany(newService)

        const token = jwt.sign(
          {username: newService.username , mail:mail},
          JWT_SECRET,
          { expiresIn: '1h' }
        );

        res.cookie('token', token, {
          httpOnly: true,      
          secure: false,       
          sameSite: 'Lax',
          maxAge: 60 * 60 * 1000 
        }).
        json({
          message: 'Success',
          token
        })
})

app.post('/signuptransport', async (req, res) => {
  const { username, password, mail,role, servicename, District, address, description, phone, services,price } = req.body;
  const hashedpass = await bcrypt.hash(password, 10);
  
      let newService ={
          username,
          password: hashedpass,
          mail,
          role,
          servicename,
          District,
          address,
          description,
          phone,
          price
      };
      await transportservices.transportservices.insertMany(newService)

      const token = jwt.sign(
        {username: newService.username , mail:mail},
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.cookie('token', token, {
        httpOnly: true,      
        secure: false,       
        sameSite: 'Lax',
        maxAge: 60 * 60 * 1000 
      }).
      json({
        message: 'Success',
        token
      })
})


app.post('/setonline', async(req,res)=>{
  const data = {
   _id: req.body._id
  }
  // console.log(data)
 const accept = await loginservices.loginservices.updateOne({_id:data._id},{$set:{available:true}})
//  console.log(accept)
 if(accept.modifiedCount>0){
  res.status(200).json({ message: 'Success' });
 }else{
  res.status(400).json({ message: 'Error' });
 }
})

app.post('/setoffline', async(req,res)=>{
  const data = {
   _id: req.body._id
  }
 const accept = await loginservices.loginservices.updateOne({_id:data._id},{$set:{available:false}})
 if(accept.modifiedCount>0){
  res.status(200).json({ message: 'Success' });
 }else{
  res.status(400).json({ message: 'Error' });
 }
})


app.post('/stockedit', async(req,res)=>{
  const data = {
   _id: req.body._id,
   stock:req.body.stock
  }
  // console.log(data)
 const accept = await loginservices.loginservices.updateOne({_id:data._id},{$set:{stock:data.stock}})
//  console.log(accept)
 if(accept.modifiedCount>0){
  res.status(200).json({ message: 'Success' });
 }else{
  res.status(400).json({ message: 'Error' });
 }
})

app.post('/priceedit', async(req,res)=>{
  const data = {
   _id: req.body._id,
   price:req.body.price
  }
  // console.log(data)
 const accept = await loginservices.loginservices.updateOne({_id:data._id},{$set:{price:data.price}})
//  console.log(accept)
 if(accept.modifiedCount>0){
  res.status(200).json({ message: 'Success' });
 }else{
  res.status(400).json({ message: 'Error' });
 }
})

app.post('/bookings', async(req,res)=>{
  const data = {
   address: req.body.address,
   district: req.body.district,
  product:req.body.product,
  quantity:req.body.quantity,
   serviceusername: req.body.serviceusername,
   servicemail: req.body.servicemail,
   servicephone: req.body.servicephone,
   clientname: req.body.clientname,
   clientphone: req.body.clientphone,
   clientmail: req.body.clientmail,
   status: req.body.status,
   bidprice: req.body.bidprice,
   paymentstatus:req.body.paymentstatus,
   logistics: req.body.logistics,
   code:req.body.code
  }
 const booked = await booking.booking.insertMany(data)
 if(data.status.includes('Accepted')){
  const update = await loginservices.loginservices.updateOne({mail:data.servicemail},{$inc:{stock:-data.quantity}})
 }
 res.status(200).json({ message: 'Success' });
})

app.post('/mybookings',  async (req, res) => {
  const { clientname, clientmail } = req.body;    
  const bookings = await booking.booking.find({
    clientname: clientname,
    clientmail: clientmail
  });

  res.json(bookings)
})

app.post('/payment', async(req,res)=>{
  const data = {
   bankname: req.body.bankname,
   reciever: req.body.reciever,
   accountno: req.body.accountno,
   clientmail:req.body.clientmail,
   amount:req.body.amount,
   servicename:req.body.servicename,
   _id:req.body._id.replace(/^S/, "")
  }
 const payments = await payment.payment.insertMany(data)
 const update = await booking.booking.updateOne({_id:data._id},{$set:{paymentstatus:'Paid'}})
 res.status(200).json({ message: 'Success' });
})

app.post('/mypayments',  async (req, res) => {
  const { clientmail } = req.body;    
  const payments = await payment.payment.find({
    clientmail: clientmail
  });
  // console.log(payments)

  res.json(payments)
})

app.post('/orders',  async (req, res) => {
  const { serviceusername,servicemail } = req.body;    
  const orders = await booking.booking.find({
    serviceusername: serviceusername,
    servicemail:servicemail
  });
  // console.log(payments)

  res.json(orders)
})

app.post('/acceptorder', async(req,res)=>{
    const data = {
     _id: req.body._id,
     quantity:req.body.quantity
    }
   const accept = await booking.booking.updateOne({_id:data._id},{$set:{status:'Accepted'}})
   const update = await loginservices.loginservices.updateOne({mail:data.servicemail},{$inc:{stock:-data.quantity}})
   if(accept.modifiedCount>0){
    res.status(200).json({ message: 'Success' });
   }else{
    res.status(400).json({ message: 'Error' });
   }
  })

  app.post('/rejectorder', async(req,res)=>{
    const data = {
     _id: req.body._id
    }
   const accept = await booking.booking.updateOne({_id:data._id},{$set:{status:'Rejected'}})
   if(accept.modifiedCount>0){
    res.status(200).json({ message: 'Success' });
   }else{
    res.status(400).json({ message: 'Error' });
   }
  })


  app.post('/recievedorder', async(req,res)=>{
    const data = {
     _id: req.body._id,
    }
   const accept = await booking.booking.updateOne({_id:data._id},{$set:{status:'Delivered'}})
  //  const update = await loginservices.loginservices.updateOne({mail:data.servicemail},{$inc:{stock:-data.quantity}})
   if(accept.modifiedCount>0){
    res.status(200).json({ message: 'Success' });
   }else{
    res.status(400).json({ message: 'Error' });
   }
  })



  app.post('/booklogistics', async(req,res)=>{
    const data = {
     
    product:req.body.product,
    quantity:req.body.quantity,
     servicename: req.body.servicename,
    from:req.body.from,
    to:req.body.to,
    total:req.body.total,
     orderid:req.body.orderid,
     status:req.body.status,
     loginame:req.body.loginame,
     logimail:req.body.logimail
    }
   const booked = await booklogistics.booklogistics.insertMany(data)
  
   res.status(200).json({ message: 'Success' });
  })

  app.post('/logisticorders',  async (req, res) => {
    const { serviceusername,servicemail } = req.body;    
    const orders = await booklogistics.booklogistics.find({
      loginame: serviceusername,
      logimail:servicemail
    });
    // console.log(payments)
  
    res.json(orders)
  })

  app.post('/accepttransportorder', async(req,res)=>{
    const data = {
     _id: req.body._id,
     currentid:req.body.currentid,
     regno:req.body.regno,
     currentlocation:req.body.currentlocation
    }
    const code = data.regno.split('').reverse().join('')
   const accept = await booking.booking.updateOne({_id:data._id},{$set:{logistics:(data.regno+","+data.currentlocation)}})
   const update = await booking.booking.updateOne({_id:data._id},{$set:{code:`Share this code with our Driver ${code}`}})
   const update2 = await booklogistics.booklogistics.updateOne({_id:data.currentid},{$set:{status:'Accepted'}})
   if(update2.modifiedCount>0 && accept.modifiedCount>0){
    res.status(200).json({ message: 'Success' });
   }else{
    res.status(400).json({ message: 'Error' });
   }
  })

  app.post('/rejecttransportorder', async(req,res)=>{
    const data = {
     _id: req.body._id,
     currentid:req.body.currentid,
     regno:req.body.regno,
     currentlocation:req.body.currentlocation
    }
    const code = data.regno.split('').reverse().join('')
   const accept = await booking.booking.updateOne({_id:data._id},{$set:{logistics:'Rejected'}})
   const update = await booking.booking.updateOne({_id:data._id},{$set:{code:''}})
   const update2 = await booklogistics.booklogistics.updateOne({_id:data.currentid},{$set:{status:'Rejected'}})
   if(update2.modifiedCount>0 && accept.modifiedCount>0){
    res.status(200).json({ message: 'Success' });
   }else{
    res.status(400).json({ message: 'Error' });
   }
  })


