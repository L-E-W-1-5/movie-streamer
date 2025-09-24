import { useContext } from 'react'
import { UserContext } from './UserContext'
import { Navigate, Outlet } from 'react-router'


export const VerifiedRoute = () => {

    const { user } = useContext(UserContext);
    
    if(!user || !user.verified || !user.token){

        return <Navigate to='/' />
    }

    return <Outlet/>
}