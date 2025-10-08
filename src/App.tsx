import './App.css';
import LoginPage from './components/LoginPage/LoginPage.tsx';
import Dashboard from './components/Dashboard/Dashboard.tsx';
import RegisterForm from './components/RegisterForm/RegisterForm.tsx';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Routes, BrowserRouter, Route } from 'react-router';
import { VerifiedRoute } from './VerifiedRoute.tsx';
import { UserProvider } from './UserProvider.tsx'
//import { useState } from 'react';

function App() {


  


  return (

    <div className="app-container d-flex justify-content-center align-items-center">
      <UserProvider>

        <BrowserRouter>

          <Routes>

            <Route path="/" element={<LoginPage/>}/>

            <Route path='/register' element={<RegisterForm/>}/>
     
            <Route element={<VerifiedRoute/>}>

              <Route path='/dashboard' element={<Dashboard/>}/>

            </Route>
    
          </Routes>
      
        </BrowserRouter>

      </UserProvider>

    </div>
  )
}

export default App
