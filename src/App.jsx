import { BrowserRouter, Routes, Route, Navigate, Router } from 'react-router-dom';
import './App.css'

import { onAuthStateChanged } from 'firebase/auth';
import { AuthProvider } from './context/AuthContext.jsx';
import { useAuthentication } from './hooks/useAuthentication';
import { useState, useEffect } from 'react';

import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import Register from './Pages/Register/Register';
import EditProfile from './Pages/EditProfile/EditProfile.jsx';
import Profile from './Pages/profile/Profile.jsx';
import Navbar from './components/Navbar.jsx';
import Error from './Pages/ErrorPage/Error.jsx';
import Footer from './components/Footer.jsx';

function App() {

  const [user, setUser] = useState(undefined)
  const {auth} = useAuthentication()

  const loadingUser = user === undefined

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

  }, [auth])

  if(loadingUser) {
    return <div className='load'>
      <h1 className='logo'>Link<span>Scape</span></h1>
      <div className="loader"></div>

    </div>
  }

  return (
   <div>
    <AuthProvider value={{user}}>
      <BrowserRouter>
        <Navbar />
          <Routes>
            <Route path='*' element={<Error />} />
            <Route path='/' element={<Home />} />
            <Route path='/login' element={!user ? <Login /> : <Home />} />
            <Route path='/register' element={!user ? <Register /> : <Home/>} />
            <Route path='/:id' element={<Profile />} />
            <Route path='/edit/:id' element={user ? <EditProfile /> : <Login />} />
          </Routes>
        <Footer/>
      </BrowserRouter>
    </AuthProvider>
   </div>
  )
}

export default App
