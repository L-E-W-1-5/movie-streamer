import './Dashboard.css'
import MovieList from '../MovieList/MovieList';
import MessageBoard from '../MessageBoard/MessageBoard';
import MoviePlayer from '../MoviePlayer/MoviePlayer';
import DashNavbar from '../DashNavbar/DashNavbar';
import { useContext, useState, useEffect } from 'react';
import AdminMenu from '../AdminMenu/AdminMenu';
import { type MovieUrl, type MovieDownloadNew, type Series, type MediaType } from '../../Types/Types';
import { UserContext } from '../../UserContext';
import { url } from '../../Url';
import { WindowFocus } from '../WindowFocus/WindowFocus';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';




const Dashboard = () => {

    const { user, setUser } = useContext(UserContext)  

    const [adminForm, showAdminForm] = useState<boolean>(false);

    const [allMovies, setAllMovies] = useState<Array<MovieDownloadNew>>([]);

    const [allSeries, setAllSeries] = useState<Series[]>([]);

    const [filteredMedia, setFilteredMedia] = useState<MediaType[]>([]);

    const [signedUrl, setSignedUrl] = useState<MovieUrl>({url: "", type: "", title: ""})

    const [messageSlide, setMessageSlide] = useState<boolean>(false); 

    const [interacted, hasInteracted] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    


    useEffect(() => {

        if(!user?.token){
                
            return;
        };

        setLoading(true);

        const fetchSeries = async () => {

            try{

                const res = await fetch(`${url}/movies/series`, {

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}` 
                    }
                })

                const series = await res.json();

                console.log("series fetch", series)

                if(res.ok && series.status === "success"){

                    setAllSeries(series.payload)
                    
                }else{

                    alert(`${series.status}: failed to get series or no series in the database at this time`);//${movies.payload}
                };

                
            }catch(err) {

                console.log(err)
            }
        }
            
            
        const fetchMedia = async () => {
                
            try{

                const res = await fetch(`${url}/movies`, {

                    mode: 'cors',

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`
                    }
                });

                const movies = await res.json() as {
                    payload: MovieDownloadNew[];
                    status: string;
                };


                if(res.ok && movies.status !== "error"){

                    setAllMovies(movies.payload);

                }else{

                    alert(`${movies.status}: failed to get movies or no movies in the database at this time`);//${movies.payload}
                };

            }catch(err){

                console.log(err);
            
            }finally{
                
                setLoading(false);
            }

        }                                              
                
        fetchMedia()

        fetchSeries()
            
    }, [user, setAllMovies, setAllSeries]);


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


    const handleAnimation = () => {

        hasInteracted(true);
    }



    return (
        
        <div className="main-dash-container d-flex flex-column justify-content-between">
            
            {allMovies && allSeries &&

                <DashNavbar allMovies={allMovies} allSeries={allSeries} setFilteredMedia={setFilteredMedia} filteredMedia={filteredMedia} showAdminForm={showAdminForm} animation={handleAnimation}/>
            }

            {interacted &&

                <AdminMenu showAdminForm={showAdminForm} setAllMovies={setAllMovies} allMovies={allMovies} allSeries={allSeries} setAllSeries={setAllSeries} adminForm={adminForm} logout={logout} />
            }

            

            {signedUrl.title !== "" &&       

                <WindowFocus level={3}>
                
                    <MoviePlayer setSignedUrl={setSignedUrl} signedUrl={signedUrl}/>
                    
                </WindowFocus>
            }

            

            <div className="dashboard-container p-3 gap-2 h-100">
                   
                <>
                {filteredMedia &&
                
                    <MovieList allMedia={filteredMedia} allMovies={allMovies} setSignedUrl={setSignedUrl} messageSlide={messageSlide}/>
        }
                </>

                <>

                    <MessageBoard setMessageSlide={setMessageSlide}/>

                </>

            </div>

            {loading && 

                <LoadingAnimation/>

            }

        </div>
    )
}

export default Dashboard;