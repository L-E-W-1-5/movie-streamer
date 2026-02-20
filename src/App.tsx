import './App.css';
import LoginPage from './components/LoginPage/LoginPage.tsx';
import Dashboard from './components/Dashboard/Dashboard.tsx';
import RegisterForm from './components/RegisterForm/RegisterForm.tsx';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Routes, Route, Navigate } from 'react-router';
import { VerifiedRoute } from './VerifiedRoute.tsx';
import { UserProvider } from './UserProvider.tsx'




function App() {




  return (

    <div className="app-container d-flex justify-content-center align-items-center">

      <UserProvider>

          <Routes>

            <Route path="/" element={<LoginPage/>}/>

            <Route path='/register' element={<RegisterForm/>}/>
     
            <Route element={<VerifiedRoute/>}>

              <Route path='/dashboard' element={<Dashboard/>}/>

            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace/>}></Route>
    
          </Routes>
      
      </UserProvider>

    </div>
  )
}

export default App
