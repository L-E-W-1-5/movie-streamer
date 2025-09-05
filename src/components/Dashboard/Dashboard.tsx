import './Dashboard.css'
import MovieList from '../MovieList/MovieList';
import MessageBoard from '../MessageBoard/MessageBoard';
import MoviePlayer from '../MoviePlayer/MoviePlayer';
import { Link } from 'react-router';
import { useState } from 'react';


type MovieUpload = {
    title: string,
    file: File | null
}


const Dashboard = () => {


    const [admin, setAdmin] = useState<boolean>(true);

    const [uploadForm, showUploadForm] = useState<boolean>(false);

    const [movieUpload, setMovieUpload] = useState<MovieUpload>({file: null, title: "" });

    const [tempUrl, setTempUrl] = useState<string>();

    //const [selectedMovie, setSelectedMovie] = useState<File | null>(null);



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
        }

        if(!movieUpload.title){
             alert("please select title first");
            return
        }

        console.log(movieUpload);

        const formData = new FormData();

        formData.append(movieUpload.title, movieUpload.file!);

        const movieUrl = URL.createObjectURL(movieUpload.file);

        console.log("created url", movieUrl)

        setTempUrl(movieUrl);

        //TODO: create the post to the backend here

        setAdmin(true); // just to stop the error
    }


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

            {tempUrl && <div>
                
                            <MoviePlayer title={movieUpload.title} url={tempUrl}/>
                
                        </div>}

          

            <div className="h-100 w-100 d-flex flex-column justify-content-center align-items-center p-3">

                <div className="dashboard-container h-100 w-100 gap-2">

                    <div className="container border-shadow dashboard-movie-container">

                        <MovieList/>

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