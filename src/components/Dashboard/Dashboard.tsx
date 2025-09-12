import './Dashboard.css'
import MovieList from '../MovieList/MovieList';
import MessageBoard from '../MessageBoard/MessageBoard';
import MoviePlayer from '../MoviePlayer/MoviePlayer';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';


//const url = 'http://localhost:3001';
const url = 'https://movie-streamer-backend.onrender.com'


type MovieUpload = {
    title: string,
    file: File | null
}

type MovieDownload = {
    name: string,
    url: string,
    genre: string,
    setMovieUrl: React.Dispatch<React.SetStateAction<string>>
}


const Dashboard = ({userState}:{userState:boolean}) => {


    const [admin, setAdmin] = useState<boolean>(true);

    const [uploadForm, showUploadForm] = useState<boolean>(false);

    const [movieUpload, setMovieUpload] = useState<MovieUpload>({file: null, title: "" });

    //const [tempUrl, setTempUrl] = useState<string>();

    const [allMovies, setAllMovies] = useState<Array<MovieDownload>>([]);

    const [movieUrl, setMovieUrl] = useState<string>("");

    


    useEffect(() => {

        const fetchAllMovies = async () => {

            const movies = await fetch(`${url}/movies`, {

                headers: {"Content-Type": "application/json"}
            })

            const res = await movies.json() as {
                payload: MovieDownload[];
                success: boolean;
            }

            if(res.success) {

                alert(res);

                setAllMovies(res.payload);
            }

        }

        fetchAllMovies();

    }, [userState])


    const handleFileUpload = (e:React.ChangeEvent<HTMLInputElement>) => {

        if(e.target.files && e.target.files.length > 0){

            setMovieUpload(prev => ({...prev, file: e.target.files![0]}));
        };
    };


    const handleTitleUpload = (e:React.ChangeEvent<HTMLInputElement>) => {

        if(e.target.value){

            setMovieUpload(prev => ({...prev, title: e.target.value}))
        }
    };


    const handleSubmit = () => {

        if(!movieUpload.file){
            alert("please select a video to upload first");
            return
        };

        if(!movieUpload.title){
             alert("please select title first");
            return
        };

        const formData = new FormData();

        formData.append('movie', movieUpload.file);

        formData.append('title', movieUpload.title)

        sendMovie(formData);

        setAdmin(true); //TODO: just to stop the error, replace with proper admin functionality
    };


    const sendMovie = async (formData: FormData) => {

        let reply = {

            payload: "",
            url: "",
            key: "",
            status: ""
        };

        try{

            const res = await fetch(`${url}/upload`, {
            
                method: "POST",

                body: formData
            })

            if(!res.ok){
                const errorText = await res.text();
                console.error('server error', res.status, errorText)
            }

            reply = await res.json();
        
        }catch(err){

            console.log("99", err);
        
        }finally{

            console.log(reply)

            console.log(reply.url, reply.url.length, reply.url.split('').length);

            // if(reply.url && reply.url.split('').length > 0){

            //     setTempUrl(reply.url);
            // }

            // console.log("102", reply);

            showUploadForm(false);
        };

    };


    return (
        
        <div className="main-dash-container d-flex flex-column justify-content-between">
            
            <nav className="dashboard-nav p-2 d-flex flex-row justify-content-between align-items-center">

                <h2 className="pt-1">LuluFlix</h2>

                {admin &&

                    <button className="btn border-shadow variable-colour" onClick={() => showUploadForm(current => !current)}>upload</button>
                }

                <Link style={{color: "var(--borderShadow)"}} to='/'>Logout</Link>

            </nav>


            {uploadForm && <div className="upload-form container-style border-shadow position-fixed h-auto p-4 gap-3 w-auto d-flex flex-column justify-content-around align-items-center">

                                <input className="btn variable-colour" type="file" name="movieFile" onChange={handleFileUpload}/>

                                <input className="btn variable-colour border-shadow" placeholder="movie title here.." type="text" name="movieTitle" onChange={handleTitleUpload}/>

                                <button className="btn border-shadow variable-colour" onClick={handleSubmit} >upload</button>

                                <button className="btn border-shadow variable-colour" onClick={() => showUploadForm(current => !current)}>close</button>

                           </div>}

            {movieUrl && <div>
                
                            <MoviePlayer title={movieUpload.title} url={movieUrl}/>
                
                        </div>}

          

            <div className="h-100 w-100 d-flex flex-column justify-content-center align-items-center p-3">

                <div className="dashboard-container h-100 w-100 gap-2">

                   
                   
                    <div className="container border-shadow dashboard-movie-container">

                        {allMovies.length > 0 &&

                            <MovieList downloadedMovies={allMovies} setMovieUrl={setMovieUrl}/>

                         }

                   </div>


                    <div className="container border-shadow dashboard-message-container flex-grow-1">

                        <MessageBoard/>

                    </div>

                </div>

            </div>

        

        </div>
    )
}

export default Dashboard;
//0.375rem