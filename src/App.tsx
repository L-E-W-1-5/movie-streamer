import './App.css';
import LoginPage from './components/LoginPage/LoginPage.tsx';
import Dashboard from './components/Dashboard/Dashboard.tsx';
import RegisterForm from './components/RegisterForm/RegisterForm.tsx';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Routes, BrowserRouter, Route, Navigate, useLocation, useNavigate } from 'react-router';
import { VerifiedRoute } from './VerifiedRoute.tsx';
import { UserProvider } from './UserProvider.tsx'
import { useContext, useEffect } from 'react';
import { UserContext } from './UserContext.ts';



function App() {


  const { user } = useContext(UserContext)

  const location = useLocation();

  const navigate = useNavigate()

  useEffect(() => {

    if(user && location.pathname === '/'){

      navigate('/dashboard')
    }

  }, [user, location, navigate])

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

            <Route path="*" element={<Navigate to="/dashboard" replace/>}></Route>
    
          </Routes>
      
        </BrowserRouter>

      </UserProvider>

    </div>
  )
}

export default App
