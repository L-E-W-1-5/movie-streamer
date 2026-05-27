import './MovieUploadForm.css'
import { useState, useContext } from "react";
import { UserContext } from "../../UserContext";
import { type MovieDownloadNew, type MovieUpload } from '../../Types/Types';
import { url } from '../../Url';







const initialMovie: MovieUpload = {
    title: '',
    genre: '',
    description: null,
    length: null,
    year: null,
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
        }
    }


    const handleSubmit = async () => {

        if(user?.username === "demo account"){

            alert("editing not available for demo account");

            return;
        };

        if(!movieUpload.file && !movieUpload.folder){

            alert("please select a video to upload first");

            return
        };

        if(!movieUpload.title){

            alert("please select title first");

            return
        };


        let chunks: File[][] = [];

        let res;


        if(movieUpload.folder && movieUpload.folder.length > 0){ 

            chunks = chunkArray(movieUpload.folder, 50);
        
            try{

                for (let i = 0; i < chunks.length; i++) {

                    console.log(chunks[i])

                    let formData = new FormData();

            
                    if(i === 0){
                
                        formData = createFormData(formData);
                    }

                    formData.append('isFirstBatch', i === 0 ? "true" : "false");

                    formData.append("batchNumber", i.toString());
        
                    chunks[i].forEach((file) => {

                        formData.append('hls_files[]', file, file.webkitRelativePath || file.name);
                    })

                    console.log("hls movie")

                    res = await sendHLS(formData);

                    if (!res || !res.ok){

                        throw new Error(`batch ${i + 1} upload failed ${res ? `with status ${res.status}` : ''}`);
                    }
            
                    // if(i === 0 && res instanceof Response){
                
                    //     await checkResponse(res);           
                    // }

                }     

                if(res) await checkResponse(res);
            
                alert("movie uploaded successfully");
        
            }catch(err){

                console.error(err);

                alert("movie upload failed");
            }

        
        // if(movieUpload.folder && movieUpload.folder.length > 0){
            
        //     movieUpload.folder.forEach((file) => {
                
        //         formData.append('hls_files[]', file, file.webkitRelativePath || file.name);
                
        //         //TODO: create batches of the segments here 
        //     })
            
        }else{

            let formData = new FormData();

            formData = createFormData(formData);
            
            if(movieUpload.file) formData.append('movie', movieUpload.file);  

            if(formData.has('movie')){

            console.log("single movie")

            const res = await sendSingleMovie(formData);

            if(res instanceof Response){

                checkResponse(res);

            }else{

                alert("Error, correct response not received from server")
            }
        };
 
                
        }
        // else{

        //     console.log("hls movie")

        //     const res = await sendHLS(formData);
            
        //     if(res instanceof Response){
                
        //         checkResponse(res);
                
        //     }else{
                
        //         alert("Error, correct response not received from server")
        //     }
        // }
    };


    const createFormData = (formData: FormData) => {


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

        if(movieUpload.images && movieUpload.images.length > 0){

            movieUpload.images.forEach((image) => {

                formData.append('images[]', image, image.name)
            })
        }

        return formData;
    }


    const sendHLS = async (formData: FormData) => {


        if(!user?.token) return;

        try{
//TODO: change to batching of segments instead of sending all at once
            const res = await fetch(`${url}/movies/stream?title=${movieUpload.title}`, { //hls

                headers: {"Authorization": `Bearer ${user.token}`},
            
                method: "POST",

                body: formData

            })
        
        console.log(res)

        return res;

        }catch(err){

            console.log(err)
        }      
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

        try{

            if(!res.ok){

                const errorText = await res.text();

                console.error('server error', res.status, errorText);

                return;

            }

            reply = await res.json();

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
                    times_played: reply.payload.times_played,
                    images: reply.payload.images ? reply.payload.images : null
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

                <input id="year" className="upload-form-element first-column btn variable-colour border-shadow input-field" type="number" placeholder="movie year" onChange={handleChanges}/>

                <input id="length" className="upload-form-element first-column btn variable-colour border-shadow input-field" type="text" placeholder="movie length" onChange={handleChanges}/>

                <textarea id="description" className="upload-form-element upload-form-textarea second-column variable-colour border-shadow input-field" placeholder="enter description here" onChange={handleChanges}/>

                
                

                <div className=" upload-form-buttons d-flex align-self-center mt-3">
                
                    <button className="upload-form-button button-style border-shadow" onClick={handleSubmit} >upload</button>

                    <button className="upload-form-button button-style border-shadow" onClick={stopMenuClosure}>close</button>

                </div>

        </div>
    )
}


export default MovieUploadForm