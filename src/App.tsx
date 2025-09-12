import './App.css';
import LoginPage from './components/LoginPage/LoginPage.tsx';
import Dashboard from './components/Dashboard/Dashboard.tsx';
import RegisterForm from './components/RegisterForm/RegisterForm.tsx';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Routes, BrowserRouter, Route } from 'react-router';
import { useState } from 'react';

function App() {


  const [user, setUser] = useState<boolean>(false);


  return (

    <div className="app-container d-flex justify-content-center align-items-center">

      <BrowserRouter>

        <Routes>

          <Route path="/" element={<LoginPage userState={setUser}/>}/>
          <Route path='/register' element={<RegisterForm/>}/>
          <Route path='/dashboard' element={<Dashboard userState={user}/>}/>

        </Routes>
      
      </BrowserRouter>

    </div>
  )
}

export default App
