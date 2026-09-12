import './MovieUploadForm.css'
import { useState, useContext, useRef } from "react";
import { UserContext } from "../../UserContext";
import { type MovieDownloadNew, type MovieUpload } from '../../Types/Types';
import { url } from '../../Url';







const initialMovie: MovieUpload = {
    title: '',
    genre: '',
    description: null,
    length: null,
    year: null,
    media_format: '',
    file: null,
    folder: [],
    images: []
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
   // showUploadForm: React.Dispatch<React.SetStateAction<boolean>>
    setAllMovies: React.Dispatch<React.SetStateAction<MovieDownloadNew[]>>
    setOpenForm: React.Dispatch<React.SetStateAction<string | null>>
}




const MovieUploadForm: React.FC<UploadFormProps> = ({ setOpenForm, setAllMovies }) => {

    const { user } = useContext(UserContext);

    const [movieUpload, setMovieUpload] = useState<MovieUpload>(initialMovie);

    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const [seriesContainer, setSeriesContainer] = useState<boolean>(false);

    const uploadController = useRef<AbortController | null>(null);



    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

        if(e.target.files && e.target.files.length > 1){ 

            const filesArray = Array.from(e.target.files);

            const playlistIndex = filesArray.findIndex(file => file.name.endsWith('.m3u8'));

            const orderedArray = filesArray;

            if(playlistIndex !== -1){

                const playlistFile = filesArray.splice(playlistIndex, 1)[0];

                orderedArray.unshift(playlistFile);     
            }

            setMovieUpload(prev => ({...prev, folder: orderedArray}));

            return;
        };

        if(e.target.files && e.target.files.length > 0){

            setMovieUpload(prev => ({...prev, file: e.target.files![0]}));
        };

    };


    const chunkArray = <T,>(array: T[], chunkSize: number) => {

        const chunks: T[][] = [];

        for (let i = 0; i < array.length; i += chunkSize) {

            chunks.push(array.slice(i, i + chunkSize))
        }

        return chunks;
    }


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

        if(e.target.files){

            const filesArray = Array.from(e.target.files);

            setMovieUpload(prev => ({...prev, images: filesArray}))
        }
    }



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

            case "mediaFormat":
            setMovieUpload(prev => ({...prev, media_format: e.target.value}))
            break;

            case "seasonNumber":
            setMovieUpload(prev => ({...prev, season_number: parseInt(e.target.value)}))
            break;

            case "episodeNumber":
            setMovieUpload(prev => ({...prev, episode_number: parseInt(e.target.value)}))
            break;

            case "episodeTitle":
            setMovieUpload(prev => ({...prev, episode_title: e.target.value}))
            break;
        }
    }


    const handleFormValidation = () => {

        if(user?.username === "demo account"){

            alert("editing not available for demo account");

            return false;
        };

        if(!movieUpload.file && !movieUpload.folder){

            alert("please select a video to upload first");

            return false;
        };

        if(!movieUpload.title){

            alert("please select title first");

            return false
        };

        if(!movieUpload.media_format){

            alert("please select media format first");

            return false;
        };

        if(movieUpload.media_format === "series") {

            if(!movieUpload.season_number) {
                alert("please enter season number");
                return false;
            }
            if(!movieUpload.episode_number) {
                alert("please enter episode number");
                return false;
            }
            if(!movieUpload.episode_title) { //TODO: consider making episode title optional in the future
                alert("please enter episode title");
                return false;
            }
        }
        return true;
    };


    const createFormData = (formData: FormData) => {


        formData.append('title', movieUpload.title);

        formData.append('media_format', movieUpload.media_format);

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

        if(movieUpload.media_format === "series"){

            if(movieUpload.season_number){

                formData.append('season_number', movieUpload.season_number.toString())
            }

            if(movieUpload.episode_number){

                formData.append('episode_number', movieUpload.episode_number.toString())
            }

            if(movieUpload.episode_title){

                formData.append('episode_title', movieUpload.episode_title)
            }
        }

        if(movieUpload.images && movieUpload.images.length > 0){

            movieUpload.images.forEach((image) => {

                formData.append('images[]', image, image.name)
            })
        }

        return formData;
    };


    const handleSubmit = async () => {

        if (!handleFormValidation()) return;
        
        console.log("movieUpload", movieUpload);

        uploadController.current = new AbortController();

        let chunks: File[][] = [];

        let res, endpoint;

        if(movieUpload.media_format === "series"){

            endpoint = `${url}/movies/stream?title=${movieUpload.title}&season=${movieUpload.season_number}&episode=${movieUpload.episode_number}`;
       
        } else {

            endpoint = `${url}/movies/stream?title=${movieUpload.title}`;
        }


        if(movieUpload.folder && movieUpload.folder.length > 0){ 

            let createdMovie = null;

            setUploadProgress(1);

            chunks = chunkArray(movieUpload.folder, 5); // Adjust the chunk size as needed
        
            try{

                //const maxRetries = 3; // Maximum number of retries for each batch
                //TODO: impliment retries

                for (let i = 0; i < chunks.length; i++) {    
                    
                    console.log(`starting batch ${i + 1}/${chunks.length}`)

                    let formData = new FormData();
            
                    if(i === 0){
                
                        formData = createFormData(formData);
                        console.log(formData);
                    }
                    
                    formData.append('isFirstBatch', i === 0 ? "true" : "false");

                    formData.append("batchNumber", i.toString());
        
                    chunks[i].forEach((file) => {

                        formData.append('hls_files[]', file, file.webkitRelativePath || file.name);
                    })

                    console.log(`uploading batch ${i + 1} of ${chunks.length}`);

                    res = await sendHLS(formData, endpoint, uploadController.current.signal);

                    if (!res || !res.ok){

                        setUploadProgress(0);
                        
                        throw new Error(`batch ${i + 1} upload failed ${res ? `with status ${res.status}` : ''}`);
                    }

                    setUploadProgress(Math.round(((i + 1) / chunks.length) * 100));

                    if(i === 0){

                        const data = await res.json();

                        createdMovie = data.payload;
                    }

                }     

                setUploadProgress(100);
                
                if(createdMovie) await checkResponse(createdMovie);
        
            }catch(err){

                console.error(err);

                if(err instanceof DOMException && err.name === "AbortError"){

                    alert("movie upload cancelled");

                    uploadController.current = null;

                } else {

                    alert("movie upload failed");
                }
            
            }finally{

                setUploadProgress(0);
            }
            
        }else{

            let formData = new FormData();

            formData = createFormData(formData);
            
            if(movieUpload.file) formData.append('movie', movieUpload.file);  

            if(formData.has('movie')){

            console.log("single movie")

            const res = await sendSingleMovie(formData, uploadController.current?.signal);

            if(res && res.ok){

                const data = await res.json();

                checkResponse(data.payload);

            }else{

                alert("Error, correct response not received from server")
            }
        };
 
                
        }
    };


    const sendHLS = async (formData: FormData, endpoint: string, signal: AbortSignal) => {

        if(!user?.token) {
            
            throw new Error("No authentication token found.");
        }

        console.log("endpoint", endpoint);

        try{

            const res = await fetch(endpoint, { //hls

                headers: {"Authorization": `Bearer ${user.token}`},
            
                method: "POST",

                body: formData,

                signal

            })
        
            console.log(res)

            return res;

        }catch(err){

            console.log(err)
        }      
    }


    const sendSingleMovie = async (formData: FormData, signal: AbortSignal) => {

        if(!user?.token) return;

        const res = await fetch(`${url}/movies`, {

            headers: {"Authorization": `Bearer ${user.token}`},
            
            method: "POST",

            body: formData,

            signal
        });

        return res;
    }


    const checkResponse = async (createdMovie: MovieDownloadNew) => { //, createdMovie: MovieDownloadNew


        if(!user?.token) return;

        try{

            if(!createdMovie){

                alert("Error creating movie");

                return;
            }
        

            if(createdMovie){

                const newUpload: MovieDownloadNew = {
                    id: createdMovie.id,
                    title: createdMovie.title,
                    key: createdMovie.key,
                    genre: createdMovie.genre,
                    description: createdMovie.description,
                    year: createdMovie.year,
                    length: createdMovie.length,
                    timestamp: createdMovie.timestamp,
                    times_played: createdMovie.times_played,
                    images: createdMovie.images ? createdMovie.images : null,
                    media_format: createdMovie.media_format,
                    season_number: createdMovie.season_number,
                    episode_number: createdMovie.episode_number,
                    episode_title: createdMovie.episode_title
                };

            setAllMovies(prev => [...prev, newUpload]);

            alert("movie uploaded successfully");

            };

        }catch(err){

            console.log(err);

            return;
        
        }finally{

            setOpenForm(null)
            //showUploadForm(false);
        }
       
    };


    const stopMenuClosure = (e: React.MouseEvent) => {

        e.stopPropagation()

        setOpenForm(null)

        //showUploadForm(false);
    }



    return(
        <div className="upload-form border-shadow container-style p-3 gap-2">

                {uploadProgress > 0 &&
            
                <div className="upload-progress-container">

                    <div className="upload-progress-animation">

                        {uploadProgress}% complete

                        <span className="ball"></span>

                    </div>
                    
                    <button className="upload-loading-button button-style border-shadow"
                        onClick={() => uploadController.current?.abort()}>
                        cancel
                    </button>
                    
                </div>
            }

                <p>movie file</p>

                <input 
                    className="upload-form-element first-column btn variable-colour border-shadow" 
                    type="file" 
                    name="movieFile" 
                    multiple   
                    {...({ webkitdirectory: true } as React.InputHTMLAttributes<HTMLInputElement>)}
                    onChange={handleFileUpload}
                />

                <p>images</p>

                <input
                    className="images upload-form-element first-column btn variable-colour border-shadow"
                    type="file"
                    name="movieImages"
                    multiple
                    {...({ webkitdirectory: true } as React.InputHTMLAttributes<HTMLInputElement>)}
                    onChange={handleImageUpload}
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

                <input 
                    id="year" 
                    className="upload-form-element first-column btn variable-colour border-shadow input-field" 
                    type="number" 
                    placeholder="movie year" 
                    onChange={handleChanges}
                />

                <input 
                    id="length" 
                    className="upload-form-element first-column btn variable-colour border-shadow input-field" 
                    type="text" 
                    placeholder="movie length" 
                    onChange={handleChanges}
                />

                <select 
                    id="mediaFormat" 
                    className="upload-form-element second-column form-select select-element variable-colour border-shadow" 
                    value={movieUpload.media_format} 
                    onChange={handleChanges}>

                        <option value="">please select</option>
                        <option value="movie">Movie</option>
                        <option value="series" onClick={() => {setSeriesContainer(false)}}>Series</option>

                </select>

                <textarea 
                    id="description" 
                    className="upload-form-element upload-form-textarea second-column variable-colour border-shadow input-field" 
                    placeholder="enter description here" 
                    onChange={handleChanges}
                />
 
                

                <div className=" upload-form-buttons d-flex align-self-center mt-3">
                
                    <button 
                        className="upload-form-button button-style border-shadow" 
                        onClick={handleSubmit}>
                        upload
                    </button>

                    <button 
                        className="upload-form-button button-style border-shadow" 
                        onClick={stopMenuClosure}>
                        close
                    </button>

                </div>

                {movieUpload.media_format === 'series' && !seriesContainer &&
                
                    <div className="series-data-container border-shadow">

                        <input
                            id="episodeTitle" 
                            type="text"
                            defaultValue={movieUpload.episode_title || ''}
                            className="upload-form-element first-column btn variable-colour border-shadow input-field" 
                            placeholder="episode title"
                            onChange={handleChanges}
                        />

                        <input
                            id="seasonNumber" 
                            type="number"
                            defaultValue={movieUpload.season_number || ''}
                            className="upload-form-element first-column btn variable-colour border-shadow input-field" 
                            placeholder="season number"
                            onChange={handleChanges}
                        />

                        <input
                            id="episodeNumber" 
                            type="number"
                            defaultValue={movieUpload.episode_number || ''}
                            className="upload-form-element first-column btn variable-colour border-shadow input-field" 
                            placeholder="episode number"
                            onChange={handleChanges}
                        />

                        <button 
                            className="upload-form-button button-style border-shadow"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSeriesContainer(true);
                            }}
                            >
                                Done
                        </button>
                    
                    </div>
                    
                }

        </div>
    )
}


export default MovieUploadForm