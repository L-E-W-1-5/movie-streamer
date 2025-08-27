import './App.css';
import LoginPage from './components/LoginPage/LoginPage.tsx';
import Dashboard from './components/Dashboard/Dashboard.tsx';
import RegisterForm from './components/RegisterForm/RegisterForm.tsx';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Routes, BrowserRouter, Route } from 'react-router';

function App() {


  return (

    <div className="app-container d-flex justify-content-center align-items-center">

      <BrowserRouter>

        <Routes>

          <Route path="/" element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterForm/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>

        </Routes>
      
      </BrowserRouter>

    </div>
  )
}

export default App
