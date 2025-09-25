import './MovieUploadForm.css'
import { useState, useContext } from "react";
import { UserContext } from "../../UserContext";

//const url = 'http://localhost:3001';
const url = 'https://movie-streamer-backend.onrender.com'


type MovieUpload = {
    title: string,
    genre: string,
    file: File | null
};

type MovieDownload = {
    id: string,
    title: string,
    url: string,
    genre: string,
};

type UploadFormProps = {
    showUploadForm: React.Dispatch<React.SetStateAction<boolean>>
    setAllMovies: React.Dispatch<React.SetStateAction<MovieDownload[]>>
}




const MovieUploadForm: React.FC<UploadFormProps> = ({setAllMovies, showUploadForm}) => {

    const { user } = useContext(UserContext);

    const [movieUpload, setMovieUpload] = useState<MovieUpload>({file: null, title: "", genre: "" });



    const handleFileUpload = (e:React.ChangeEvent<HTMLInputElement>) => {

        if(e.target.files && e.target.files.length > 0){

            setMovieUpload(prev => ({...prev, file: e.target.files![0]}));
        };

    };


    const handleTitleUpload = (e:React.ChangeEvent<HTMLInputElement>) => {

        if(e.target.value){

            setMovieUpload(prev => ({...prev, title: e.target.value}));
        };
    };

    
    const handleGenreUpload = (e:React.ChangeEvent<HTMLSelectElement>) => {

        if(e.target.value){

            setMovieUpload(prev => ({...prev, genre: e.target.value}))
        };
    };


    const handleSubmit = () => {

        if(!movieUpload.genre){
            alert("please select a video to upload first");
        }

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

        formData.append('title', movieUpload.title);

        formData.append('genre', movieUpload.genre)

        sendMovie(formData);
    };


    const sendMovie = async (formData: FormData) => {

        let reply

        if(!user?.token){

            return;
        }

        try{

            const res = await fetch(`${url}/movies`, {

                headers: {"Authorization": `Bearer ${user.token}`},
            
                method: "POST",

                body: formData
            });

            if(!res.ok){

                const errorText = await res.text();

                console.error('server error', res.status, errorText);

                showUploadForm(false);

                return;
            };

            reply = await res.json();

             if(reply.status === "error"){

                alert(reply.payload);

                showUploadForm(false);

                return;
            }
        
        }catch(err){

            console.log(err);

            showUploadForm(false);

            return;
        
        }finally{

            if(reply.status === "success"){

                const newUpload:MovieDownload = {
                    id: reply.payload.id,
                    title: reply.payload.title ,
                    url: reply.payload.url,
                    genre: reply.payload.genre
                };

                setAllMovies(prev => [...prev, newUpload]);
            };

            showUploadForm(false);
        };
    };


    const stopMenuClosure = (e: React.MouseEvent) => {

        e.stopPropagation()

        showUploadForm(false);
    }



    return(
        <div className="upload-form border-shadow container-style d-flex flex-column justify-content-center p-3 align-items-center gap-2">

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

                <button className="btn border-shadow variable-colour" onClick={stopMenuClosure}>close</button>

        </div>
    )
}


export default MovieUploadForm