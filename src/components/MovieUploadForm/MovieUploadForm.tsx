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
    file: File | null,
    folder?: File[]
};

const initialMovie: MovieUpload = {
    title: '',
    genre: '',
    description: null,
    length: null,
    year: null,
    file: null,
    folder: []
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

        console.log("60", e);

        if(e.target.files && e.target.files.length > 1){

            const filesArray = Array.from(e.target.files);

            setMovieUpload(prev => ({...prev, folder: filesArray}));

            return;
        };

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


    const handleSubmit = async () => {

        if(!movieUpload.file && !movieUpload.folder){
            alert("please select a video to upload first");
            return
        };

        if(!movieUpload.title){
             alert("please select title first");
            return
        };


        const formData = new FormData();

        
        if(movieUpload.folder && movieUpload.folder.length > 0){
            
            movieUpload.folder.forEach((file) => {
                
                formData.append('hls_files[]', file, file.webkitRelativePath || file.name);
                
                console.log(file);
            })
            
        }else{

            if(movieUpload.file) formData.append('movie', movieUpload.file);    
        };

        
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

        if(formData.has('movie')){

            console.log("single movie")

            const res = await sendSingleMovie(formData);

            if(res instanceof Response){

                checkResponse(res);

            }else{

                alert("Error, correct response not received from server")
            }
                
        }
        else{

            console.log("hls movie")

            const res = await sendHLS(formData);
            
            if(res instanceof Response){
                
                checkResponse(res);
                
            }else{
                
                alert("Error, correct response not received from server")
            }
        }
    };


    const sendHLS = async (formData: FormData) => {

        if(!user?.token) return;

        const res = await fetch(`${url}/movies/hls`, {

            headers: {"Authorization": `Bearer ${user.token}`},
            
            method: "POST",

            body: formData
        });

        return res;
            
    }

    const sendSingleMovie = async (formData: FormData) => {

        if(!user?.token) return;

        const res = await fetch(`${url}/movies`, {

            headers: {"Authorization": `Bearer ${user.token}`},
            
            method: "POST",

            body: formData
        });

        return res;
    }


    const checkResponse = async (res: Response) => {

        let reply

        if(!user?.token) return;

        console.log(res);

        try{

            if(!res.ok){

                const errorText = await res.text();

                console.error('server error', res.status, errorText);

                return;

            }

            reply = await res.json();

            console.log("251", reply)

            if(reply.status === "error"){

                alert(reply.payload);

                return;
            }
        

            if(reply && reply.status === "success"){

                const newUpload: MovieDownloadNew = {
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

        }catch(err){

            console.log(err);

            return;
        
        }finally{

            showUploadForm(false);
        }
       
    };


    const stopMenuClosure = (e: React.MouseEvent) => {

        e.stopPropagation()

        showUploadForm(false);
    }



    return(
        <div className="upload-form border-shadow container-style p-3 gap-2">

                <input 
                    className="upload-form-element first-column btn variable-colour border-shadow" 
                    type="file" 
                    name="movieFile" 
                    multiple   
                    {...({ webkitdirectory: true } as React.InputHTMLAttributes<HTMLInputElement>)}
                    onChange={handleFileUpload}
                />

                <input 
                    id="title" 
                    className="upload-form-element first-column btn variable-colour border-shadow input-field" 
                    placeholder="movie title here.." 
                    type="text" 
                    name="movieTitle" 
                    onChange={handleChanges}
                />

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

                <div className="d-flex flex-row gap-5 align-self-center upload-form-buttons mt-3">
                
                    <button className="upload-form-button button-style border-shadow" onClick={handleSubmit} >upload</button>

                    <button className="upload-form-button button-style border-shadow" onClick={stopMenuClosure}>close</button>

                </div>

        </div>
    )
}


export default MovieUploadForm