import './MovieUploadForm.css'
import { useState, useContext } from "react";
import { UserContext } from "../../UserContext";
import { type MovieDownloadNew } from '../../Types/Types';
import { url } from '../../Url';



type MovieUpload = {
    title: string,
    genre: string,
    description: string | null,
    length: string | null,
    year: number | null,
    file: File | null
};

const initialMovie: MovieUpload = {
    title: '',
    genre: '',
    description: null,
    length: null,
    year: null,
    file: null
}

// type MovieDownload = {
//     id: number,
//     title: string,
//     description: string | null,
//     length: string | null,
//     year: number | null,
//     genre: string | null,
//     timestamp: Date 
// };

type UploadFormProps = {
    showUploadForm: React.Dispatch<React.SetStateAction<boolean>>
    setAllMovies: React.Dispatch<React.SetStateAction<MovieDownloadNew[]>>
}




const MovieUploadForm: React.FC<UploadFormProps> = ({setAllMovies, showUploadForm}) => {

    const { user } = useContext(UserContext);

    const [movieUpload, setMovieUpload] = useState<MovieUpload>(initialMovie);



    const handleFileUpload = (e:React.ChangeEvent<HTMLInputElement>) => {

        if(e.target.files && e.target.files.length > 0){

            setMovieUpload(prev => ({...prev, file: e.target.files![0]}));
        };

    };



    function handleChanges<T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> (e: React.ChangeEvent<T>){

        const { id } = e.target;

        switch(id){
            case "description":
            setMovieUpload(prev => ({...prev, description: e.target.value}))
            break;

            case "title":
            setMovieUpload(prev => ({...prev, title: e.target.value}))
            break;

            case "genre":
            setMovieUpload(prev => ({...prev, genre: e.target.value}))
            break;

            case "year":
            setMovieUpload(prev => ({...prev, year: parseInt(e.target.value)}))
            break;

            case "length":
            setMovieUpload(prev => ({...prev, length: e.target.value}))
            break;
        }
    }


    const handleSubmit = () => {

        console.log(movieUpload)

        if(!movieUpload.file){
            alert("please select a video to upload first");
            return
        };

        if(!movieUpload.title){
             alert("please select title first");
            return
        };

        // if(!movieUpload.year){

        //     alert("no description")
        // }

       

        const formData = new FormData();

        formData.append('movie', movieUpload.file);

        formData.append('title', movieUpload.title);

        if(movieUpload.genre){

            formData.append('genre', movieUpload.genre);
        }

        if(movieUpload.description){

            formData.append('description', movieUpload.description)
        }

        if(movieUpload.year){

            formData.append('year', movieUpload.year.toString())
        }

        if(movieUpload.length){

            formData.append('length', movieUpload.length)
        }

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

                const newUpload:MovieDownloadNew = {
                    id: reply.payload.id,
                    title: reply.payload.title,
                    key: reply.payload.key,
                    genre: reply.payload.genre,
                    description: reply.payload.description,
                    year: reply.payload.year,
                    length: reply.payload.length,
                    timestamp: reply.payload.timestamp,
                    times_played: reply.payload.times_played
                };

                setAllMovies(prev => [...prev, newUpload]);

                alert("movie uploaded successfully");
            };

            showUploadForm(false);
        };
    };


    const stopMenuClosure = (e: React.MouseEvent) => {

        e.stopPropagation()

        showUploadForm(false);
    }



    return(
        <div className="upload-form border-shadow container-style p-3 gap-2">

                <input className="upload-form-element first-column btn variable-colour border-shadow" type="file" name="movieFile" onChange={handleFileUpload}/>

                <input id="title" className="upload-form-element first-column btn variable-colour border-shadow input-field" placeholder="movie title here.." type="text" name="movieTitle" onChange={handleChanges}/>

                <select id="genre" className="upload-form-element first-column form-select select-element variable-colour border-shadow" value={movieUpload.genre} onChange={handleChanges}>
                    <option value="">please select</option>
                    <option value="action">Action</option>
                    <option value="comedy">Comedy</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="horror">Horror</option>
                    <option value="sci-fi">Sci-Fi</option>
                    <option value="thriller">Thriller</option>
                </select>

                <input id="year" className="upload-form-element first-column btn variable-colour border-shadow input-field" type="number" placeholder="movie year" onChange={handleChanges}/>

                <textarea id="description" className="upload-form-element upload-form-textarea second-column variable-colour border-shadow input-field" placeholder="enter description here" onChange={handleChanges}/>

                <input id="length" className="upload-form-element first-column btn variable-colour border-shadow input-field" type="text" placeholder="movie length" onChange={handleChanges}/>

                <div className="d-flex flex-row gap-5 align-self-center upload-form-buttons">
                
                    <button className="upload-form-button btn border-shadow variable-colour" onClick={handleSubmit} >upload</button>

                    <button className="upload-form-button btn border-shadow variable-colour" onClick={stopMenuClosure}>close</button>

                </div>

        </div>
    )
}


export default MovieUploadForm