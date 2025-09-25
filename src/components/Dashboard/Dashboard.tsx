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


    // const handleFileUpload = (e:React.ChangeEvent<HTMLInputElement>) => {

    //     if(e.target.files && e.target.files.length > 0){

    //         setMovieUpload(prev => ({...prev, file: e.target.files![0]}));
    //     };

    // };


    // const handleTitleUpload = (e:React.ChangeEvent<HTMLInputElement>) => {

    //     if(e.target.value){

    //         setMovieUpload(prev => ({...prev, title: e.target.value}));
    //     };
    // };

    
    // const handleGenreUpload = (e:React.ChangeEvent<HTMLSelectElement>) => {

    //     if(e.target.value){

    //         setMovieUpload(prev => ({...prev, genre: e.target.value}))
    //     };
    // };


    // const handleSubmit = () => {

    //     if(!movieUpload.genre){
    //         alert("please select a video to upload first");
    //     }

    //     if(!movieUpload.file){
    //         alert("please select a video to upload first");
    //         return
    //     };

    //     if(!movieUpload.title){
    //          alert("please select title first");
    //         return
    //     };

    //     const formData = new FormData();

    //     formData.append('movie', movieUpload.file);

    //     formData.append('title', movieUpload.title);

    //     formData.append('genre', movieUpload.genre)

    //     sendMovie(formData);
    // };


    // const sendMovie = async (formData: FormData) => {

    //     let reply

    //     if(!user?.token){

    //         return;
    //     }

    //     try{

    //         const res = await fetch(`${url}/movies`, {

    //             headers: {"Authorization": `Bearer ${user.token}`},
            
    //             method: "POST",

    //             body: formData
    //         });

    //         if(!res.ok){

    //             const errorText = await res.text();

    //             console.error('server error', res.status, errorText);

    //             showAdminForm(false);

    //             return;
    //         };

    //         reply = await res.json();

    //          if(reply.status === "error"){

    //             alert(reply.payload);

    //             showAdminForm(false);

    //             return;
    //         }
        
    //     }catch(err){

    //         console.log(err);

    //         showAdminForm(false);

    //         return;
        
    //     }finally{

    //         if(reply.status === "success"){

    //             const newUpload:MovieDownload = {
    //                 id: reply.payload.id,
    //                 title: reply.payload.title ,
    //                 url: reply.payload.url,
    //                 genre: reply.payload.genre
    //             };

    //             setAllMovies(prev => [...prev, newUpload]);
    //         };

    //         showAdminForm(false);
    //     };
    // };

    const preventClosureOfMenu = (e: React.MouseEvent) => {

        e.stopPropagation();

        showAdminForm(true)
    }



    return (
        
        <div className="main-dash-container d-flex flex-column justify-content-between">
            
            <nav className="dashboard-nav p-2 d-flex flex-row justify-content-between align-items-center">

                <h2 className="pt-1">LuluFlix</h2>

                {user?.admin &&

                    <button className="btn border-shadow variable-colour" onClick={preventClosureOfMenu}>upload</button>
                }

                <p className="logout-link" style={{color: "var(--borderShadow)"}} onClick={() => setUser(null)}>Logout</p>

            </nav>


            {/* {adminForm && 

            <div className="upload-form container-style border-shadow position-fixed h-auto p-4 gap-3 w-auto d-flex flex-column justify-content-around align-items-center">

                <input className="btn variable-colour" type="file" name="movieFile" onChange={handleFileUpload}/>

                <input className="btn variable-colour border-shadow input-field" placeholder="movie title here.." type="text" name="movieTitle" onChange={handleTitleUpload}/>

                <select className="form-select select-element variable-colour border-shadow" value={movieUpload.genre} onChange={handleGenreUpload}>
                    <option value="">please select</option>
                    <option value="action">Action</option>
                    <option value="comedy">Comedy</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="horror">Horror</option>
                    <option value="sci-fi">Sci-Fi</option>
                    <option value="thriller">Thriller</option>
                </select>

                <button className="btn border-shadow variable-colour" onClick={handleSubmit} >upload</button>

                <button className="btn border-shadow variable-colour" onClick={() => showAdminForm(current => !current)}>close</button>

            </div>} */}

            {adminForm &&
                <AdminForm showAdminForm={showAdminForm} setAllMovies={setAllMovies} adminForm={adminForm}/>
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