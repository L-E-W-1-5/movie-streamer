import './Dashboard.css'
import MovieList from '../MovieList/MovieList';
import MessageBoard from '../MessageBoard/MessageBoard';
import MoviePlayer from '../MoviePlayer/MoviePlayer';
import UserOptions from '../UserOptions/UserOptions';
import DashNavbar from '../DashNavbar/DashNavbar';
import { useContext, useState } from 'react';
import AdminMenu from '../AdminMenu/AdminMenu';
import { type MovieUrl, type MovieDownloadNew } from '../../Types/Types';
import { UserContext } from '../../UserContext';
import { url } from '../../Url';




const Dashboard = () => {

    const { user, setUser } = useContext(UserContext) 

    const [adminForm, showAdminForm] = useState<boolean>(false);

    const [allMovies, setAllMovies] = useState<Array<MovieDownloadNew>>([]);

    const [signedUrl, setSignedUrl] = useState<MovieUrl>({url: "", type: "", title: ""})

    const [userOptions, setUserOptions] = useState<boolean>(false);


    const logout = async () => {

        const logout = confirm("are you sure you wish to log out?");

        if(logout){

            const isLoggedOut = await setLogout();

            if(isLoggedOut){

                setUser(null);
        
                sessionStorage.removeItem('session_user');
            
            }else{

                alert("error logging user out");
            }

        };
    };


    const setLogout = async () => {
    
        try{
    
            const res = await fetch(`${url}/users/user_logout`, {
    
                method: 'POST',
    
                headers: {
                    "Content-Type": "application/json"
                },
    
                body: JSON.stringify({user})
            })
    
            const response = await res.json();
    
            if(response.status !== "error"){
    
                return true
                
            }else{
    
                return false
            }
    
            
        }catch(err){
    
            console.log(err)
    
            alert("could not logout");
    
            return false
        };
    };



    return (
        
        <div className="main-dash-container d-flex flex-column justify-content-between">
            

            <DashNavbar showUserOptions={setUserOptions} showAdminForm={showAdminForm}/>


            {adminForm &&

                <AdminMenu showAdminForm={showAdminForm} setAllMovies={setAllMovies} allMovies={allMovies} adminForm={adminForm} logout={logout} />
            }

            {userOptions && 
            
                <UserOptions logout={logout}/>
            }

            {signedUrl.title !== "" && 

            <div>
                
                <MoviePlayer setSignedUrl={setSignedUrl} signedUrl={signedUrl}/>
                
            </div>}

            

            <div className="dashboard-container p-3 gap-2 h-100">
                   
                <div className="dashboard-movie-container border-shadow">

                    <MovieList allMovies={allMovies} setAllMovies={setAllMovies} setSignedUrl={setSignedUrl}/>

                </div>

                <div className="dashboard-message-container border-shadow p-2">

                    <MessageBoard/>

                </div>

            </div>

            

        </div>
    )
}

export default Dashboard;