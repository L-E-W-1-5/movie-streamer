import './Dashboard.css'
import MovieList from '../MovieList/MovieList';
import MessageBoard from '../MessageBoard/MessageBoard';
import MoviePlayer from '../MoviePlayer/MoviePlayer';
//import { Link } from 'react-router';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import AdminForm from '../AdminMenu/AdminMenu';

//TODO: url change 
//const url = 'http://localhost:3001';
const url = 'https://movie-streamer-backend.onrender.com'




// type MovieUpload = {
//     title: string,
//     genre: string,
//     file: File | null
// };

type MovieDownload = {
    id: string,
    title: string,
    url: string,
    genre: string,
};


const Dashboard = () => {


    const { user, setUser } = useContext(UserContext)

    const [adminForm, showAdminForm] = useState<boolean>(false);

    //const [movieUpload, setMovieUpload] = useState<MovieUpload>({file: null, title: "", genre: "" });

    const [allMovies, setAllMovies] = useState<Array<MovieDownload>>([]);

    const [movieUrl, setMovieUrl] = useState<MovieDownload>({title: "", url: "", genre: "", id: ""});

    const [loading, setLoading] = useState<boolean>(false);
 


    useEffect(() => {

        const fetchAllMovies = async () => {

            setLoading(true);

            if(!user?.token){

                return;
            }

            try{

                const res = await fetch(`${url}/movies`, {

                    mode: 'cors',

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`
                    }
                });

                const movies = await res.json() as {
                    payload: MovieDownload[];
                    status: string;
                };

                if(res.ok && movies.status !== "error") {

                    setAllMovies(movies.payload);
            
                }else{

                    alert(`${movies.status}: failed to get movies or no movies in the database at this time`);//${movies.payload}
                };
        
            }catch(err){

                console.log(err);
            
            }finally{
                
                setLoading(false);
            }
        };

        fetchAllMovies();

    }, [user]);


    const preventClosureOfMenu = (e: React.MouseEvent) => {

        e.stopPropagation();

        showAdminForm(current => !current)
    };


    const logout = () => {

        const logout = confirm("are you sure you wish to log out?");

        if(logout){

            //TODO: create a fetch here to set is_loggedin to false

            setUser(null);
    
            sessionStorage.removeItem('session_user');
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

            {movieUrl.title !== "" && 

            <div>
                
                <MoviePlayer film={movieUrl} setMovieUrl={setMovieUrl}/>
                
            </div>}

            

            <div className="dashboard-container p-3 gap-2 h-100">
                   
                <div className="dashboard-movie-container border-shadow">

                    {allMovies.length > 0 &&

                        <MovieList downloadedMovies={allMovies} setMovieUrl={setMovieUrl}/>

                    }
                
                </div>

                <div className="dashboard-message-container border-shadow p-2">

                    <MessageBoard/>

                </div>

            </div>

            {loading && 

            <div className='loading-animation'>
                
                <h1>LOADING...</h1>
                
            </div>}

        </div>
    )
}

export default Dashboard;
//0.375rem