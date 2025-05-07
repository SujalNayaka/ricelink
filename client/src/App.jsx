import { useState } from 'react'

import Home from './components/home' 
import Login from './components/login'
import Serviceprovider from './components/serviceprovider'
import Transport from './components/transport' 
import Bookings from './components/bookings'
import Profile from './components/profile'
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
       <Route path='/login' element={<Login/>}/>
     <Route path='/serviceprovider' element={<Serviceprovider/>}/>
      <Route path='/transport' element={<Transport/>}/>
     <Route path='/bookings' element={<Bookings/>}/>
      <Route path='/profile' element={<Profile/>}/>
      {/* <Route path='' element/> */}
      {/* <Route path='/transportprovider' element={<Transportprovider/>}/> */}
    </Routes>
    </BrowserRouter>
  )
}

export default App
