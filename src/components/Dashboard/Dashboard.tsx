import './Dashboard.css'
import MovieList from '../MovieList/MovieList';
import MessageBoard from '../MessageBoard/MessageBoard';
import MoviePlayer from '../MoviePlayer/MoviePlayer';
//import { Link } from 'react-router';
import { useState, useContext } from 'react';
import { UserContext } from '../../UserContext';
import AdminForm from '../AdminMenu/AdminMenu';
import { type MovieUrl } from '../../Types/Types';

//TODO: url change 
const url = 'http://localhost:3001';
//const url = 'https://movie-streamer-backend.onrender.com'

type MovieDownload = {
    id: string,
    title: string,
    url: string,
    genre: string,
};




const Dashboard = () => {


    const { user, setUser } = useContext(UserContext)

    const [adminForm, showAdminForm] = useState<boolean>(false);

    const [allMovies, setAllMovies] = useState<Array<MovieDownload>>([]);

    const [signedUrl, setSignedUrl] = useState<MovieUrl>({url: "", title: ""})

    



    const preventClosureOfMenu = (e: React.MouseEvent) => {

        e.stopPropagation();

        showAdminForm(current => !current)
    };


    const logout = async () => {

        const logout = confirm("are you sure you wish to log out?");

        if(logout){

            //TODO: create a fetch here to set is_loggedin to false

            const isLoggedOut = await setLogout();

            if(isLoggedOut){

                setUser(null);
        
                sessionStorage.removeItem('session_user');
            
            }else{

                alert("error logging user out");
            }

        }

    }


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
        }
    }



    return (
        
        <div className="main-dash-container d-flex flex-column justify-content-between">
            
            <nav className="dashboard-nav p-2 d-flex flex-row justify-content-between align-items-center">

                <h2 className="pt-1">LuluFlix</h2>

                {user?.admin &&

                    <button className="btn border-shadow variable-colour" onClick={preventClosureOfMenu}>upload</button>
                }

                <p className="logout-link" style={{color: "var(--borderShadow)"}} onClick={logout}>Logout</p>

            </nav>


            {adminForm &&

                <AdminForm showAdminForm={showAdminForm} setAllMovies={setAllMovies} allMovies={allMovies} adminForm={adminForm}/>
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
//0.375rem