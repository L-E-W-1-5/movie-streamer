import { useContext, useState } from 'react'
import { UserContext } from '../../UserContext';
import { type MovieDownloadNew, type MovieImage } from '../../Types/Types';
import { url } from '../../Url';
import './MovieEditDetails.css'



// type MovieDownload = {
//     id: string,
//     title: string,
//     url: string,
//     genre: string,
// };

type MovieDetailsProps = {
    movie: MovieDownloadNew
    setAllMovies: React.Dispatch<React.SetStateAction<MovieDownloadNew[]>>
    setMovieEditContainer: React.Dispatch<React.SetStateAction<{
        movie: MovieDownloadNew,
        position: {
            top: number,
            left: number
        }
    } | null>>
}

const defaultOptions: MovieDownloadNew = {
    id: 0,
    title: "",
    key: "",
    description: null,
    length: null,
    year: null,
    genre: null,
    timestamp: new Date(),
    times_played: 0,
    images: null,
    image: null
}




const MovieEditDetails: React.FC<MovieDetailsProps> = ({movie, setAllMovies, setMovieEditContainer}) => {

    const { user } = useContext(UserContext);

    const [ edit, setEdit ] = useState<MovieDownloadNew>(defaultOptions)

    const [editForm, setEditForm] = useState<boolean>(false)



    const handleDelete = async () => {
    
        const confirmed = window.confirm("are you sure you wish to delete this movie?");
    
        if(!confirmed) return;
    
        if(!user?.token) return;
    
        try{
    
            const res = await fetch(`${url}/movies/delete_movie`, {
    
                method: 'POST',
    
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
    
                body: JSON.stringify({movie})
    
            });
    
            const response = await res.json();
    
            if(res.ok && response.status === "success"){
    
                console.log(response)

                setAllMovies(prevMovies => prevMovies.filter(m => m.id !== movie.id))
            }
    
    
            }catch(err){
    
                console.log(err);
            }
    };


    const handleDeleteImage = async (image: MovieImage) => {

        console.log(image)

        const confirmed = confirm("are you sure you want to delete this image?");

        if(!confirmed) return;

        if(!user?.token) return;

        try{

            const res = await fetch(`${url}/movies/image_delete`, {

                method: 'post',

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${user.token}`
                },

                body: JSON.stringify({image})
            })

            if(!res.status.toString().startsWith('2')){

                alert("Network issue: Unable to delete image")
            }
                
            const response = await res.json()

            alert(response.payload)


        }catch(err){

            console.error(err)
        }
    }


    const handleuploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const value = e.target.files;

        console.log( value )

        if(e.target.files){

            const filesArray = Array.from(e.target.files)
            
            setEdit(prev => ({...prev, image: filesArray}))
        }
    }


    const handleEditOptions = async (e: React.MouseEvent<HTMLButtonElement>) => {

        e.stopPropagation();

        setEditForm(true)

        setEdit(movie);
    }

    const closeForm = (e: React.MouseEvent<HTMLButtonElement>) => {

        e.stopPropagation()

        setMovieEditContainer(null);
    }

    const closeEdit = (e: React.MouseEvent<HTMLButtonElement>) => {

        e.stopPropagation()

        setEditForm(false)
    };

    function changeNewEdit<T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> (e: React.ChangeEvent<T>){

        e.stopPropagation();

        const { id, value } = e.target;

        if(!id || !value) return;

        switch(id){

            case "title":
            setEdit(prev => ({...prev, title: value}))
            break;
           
            case "description":
            setEdit(prev => ({...prev, description: value}))
            break;

            case "genre":
            setEdit(prev => ({...prev, genre: value}))
            break;

            case "year":
            setEdit(prev => ({...prev, year: parseInt(value)}))
            break;

            case "length":
            setEdit(prev => ({...prev, length: value}))
            break;
        }
    };


    const makeFormData = () => {

        const formData = new FormData();

        formData.append('id', edit.id.toString())

        formData.append('title', edit.title);

        if(edit.genre) formData.append('genre', edit.genre);

        if(edit.description) formData.append('description', edit.description);

        if(edit.year) formData.append('year', edit.year.toString());

        if(edit.length) formData.append('length', edit.length);

        if(edit.image && edit.image.length > 0){

            edit.image.forEach((i) => {

                formData.append('image[]', i, i.name)
            })
        } 

        console.log(formData)

        return formData
    }


    const updateMovieDetails = async () => {

        console.log(edit);

        const form = makeFormData()

        try{

            const res = await fetch(`${url}/movies/update_movie`, {

                method: 'POST',

                headers: {
                    "authorization": `Bearer ${user?.token}`
                },

                body: form
            })

            const response = await res.json();

            if(res.ok && response.status === "success"){

                setAllMovies(prevMovies => {
                    return prevMovies.map(movie => 
                        movie.id === edit.id ? {...movie, ...edit} : movie
                    )
                })

                alert("movie updated successfully");
            }

        }catch(err){

            console.log(err);
        }
    }




    return(

        <div className="movie-record d-flex flex-column justify-content-around align-items-center w-100">
            
            {!editForm &&
            <>
                
                <h4 className="mt-4">{movie.title}</h4>
                <span>{movie.genre}</span>
                <span>{movie.description}</span>
                <span>{`year of movie: ${movie.year}`}</span>
                <span>{`date of upload: ${movie.timestamp}`}</span>
                <span>{`number of times played: ${movie.times_played}`}</span>
                <span>{movie.length ? `length of movie: ${movie.length}` : ""}</span>
                <span>{movie.key}</span>

                <div className="d-flex flex-row gap-5 mb-4 mt-4">

                    <button className="button-style border-shadow" onClick={handleDelete}>delete</button>

                    <button className="button-style border-shadow" onClick={handleEditOptions}>edit</button>

                    <button className="button-style border-shadow" onClick={closeForm}>close</button>
            
                </div>

            </>
            }

            {editForm && 
            
                <div className="edit-form-container h-100">

                    <div className="form-grid p-4 h-100">

                        <div className="first-column d-flex flex-column justify-content-around">

                            <label>title: 
                                <input id="title" className="movie-edit-details-element btn variable-colour border-shadow" defaultValue={movie.title} onChange={changeNewEdit}/>
                            </label>

                            <label>genre: 
                                <select id="genre" className="movie-edit-details-element first-column form-select select-element variable-colour border-shadow" defaultValue={movie.genre ? movie.genre : ""} onChange={changeNewEdit}>
                                    <option value="">please select</option>
                                    <option value="action">Action</option>
                                    <option value="comedy">Comedy</option>
                                    <option value="fantasy">Fantasy</option>
                                    <option value="horror">Horror</option>
                                    <option value="sci-fi">Sci-Fi</option>
                                    <option value="thriller">Thriller</option>
                                </select>
                            </label>

                            <label>year: 
                                <input id="year" className="movie-edit-details-element btn variable-colour border-shadow" type="number" defaultValue={movie.year ? movie.year : ""} onChange={changeNewEdit}/>
                            </label>

                            <label>length
                                <input id="length" className="movie-edit-details-element btn variable-colour border-shadow" type="text" defaultValue={movie.length ? movie.length : ""} onChange={changeNewEdit}/>
                            </label>

                        </div>
                   
                        <div className="second-column h-100">

                            <label>description: 
                                <textarea id="description" className="edit-details-textarea variable-colour border-shadow input-field" defaultValue={movie.description ? movie.description : ""} onChange={changeNewEdit}/>
                            </label>

                        </div>

                        <div className="image-edit">

                            <div className="d-flex flex-column">

                                <h5>images</h5>

                                <div className='d-flex flex-row'>

                                    {movie.images && 
                                        <>

                                            {movie.images.map((image: MovieImage, x: number) => {

                                                return <div className="image-viewport">
                                                    
                                                    <p>{x + 1}: {image.original_name}<button className='delete-cross' onClick={() => handleDeleteImage(image)}></button></p>
                                                
                                                    

                                                    <img className="image-display" src={image.url}/>

                                                </div>
                                            })}

                                        </>       
                                    }
                         
                                </div>

                            </div>

                            <input type="file" className="button-style border-shadow mt-3 w-50" onChange={handleuploadImage}/>

                        </div>

                        <div className="form-grid-button-container d-flex gap-3">

                            <button className="button-style border-shadow align-self-center" onClick={updateMovieDetails}>update</button>

                            <button className="button-style border-shadow align-self-center" onClick={closeEdit}>close</button>

                        </div>

                    </div>

                </div>
            
            }

        </div>
    )
}

export default MovieEditDetails