import { useContext, useState } from 'react'
import { UserContext } from '../../UserContext';
import { type MovieDownloadNew } from '../../Types/Types';
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
    showMovieDetails: React.Dispatch<React.SetStateAction<MovieDownloadNew | null>>
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
    times_played: 0
}




const MovieEditDetails: React.FC<MovieDetailsProps> = ({movie, setAllMovies, showMovieDetails}) => {

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
    
    
                setAllMovies(prevMovies => prevMovies.filter(m => m.id !== movie.id))
            }
    
    
            }catch(err){
    
                console.log(err);
            }
    };


    const handleEditOptions = async (e: React.MouseEvent<HTMLButtonElement>) => {

        e.stopPropagation();

        setEditForm(true)

        setEdit(movie);
    }

    const closeForm = (e: React.MouseEvent<HTMLButtonElement>) => {

        e.stopPropagation()

        showMovieDetails(null);
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


    const updateMovieDetails = async () => {

        console.log(edit);

        try{

            const res = await fetch(`${url}/movies/update_movie`, {

                method: 'POST',

                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${user?.token}`
                },

                body: JSON.stringify({edit})
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

        <div className="d-flex flex-column justify-content-around align-items-center h-100 w-100">
            
            {!editForm &&
            <>
                
                <h4>{movie.title}</h4>
                <span>{movie.genre}</span>
                <span>{movie.description}</span>
                <span>{`year of movie: ${movie.year}`}</span>
                <span>{`date of upload: ${movie.timestamp}`}</span>
                <span>{`number of times played: ${movie.times_played}`}</span>
                <span>{movie.length ? `length of movie: ${movie.length}` : ""}</span>

                <div className="d-flex flex-row gap-5">

                    <button className="btn border-shadow variable-colour" onClick={handleDelete}>delete</button>

                    <button className="btn border-shadow variable-colour" onClick={handleEditOptions}>edit</button>

                    <button className="btn border-shadow variable-colour" onClick={closeForm}>close</button>
            
                </div>

            </>
            }

            {editForm && 
            
                <div className="edit-form-container h-100">

                    <div className="form-grid p-4 h-100">

                        <div className="first-column d-flex flex-column justify-content-around align-items-end">

                            <label>title: 
                                <input id="title" defaultValue={movie.title} onChange={changeNewEdit}/>
                            </label>

                            <label>genre: 
                                <select id="genre" defaultValue={movie.genre ? movie.genre : ""} onChange={changeNewEdit}>
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
                                <input id="year" type="number" defaultValue={movie.year ? movie.year : ""} onChange={changeNewEdit}/>
                            </label>

                            <label>length
                                <input id="length" type="text" defaultValue={movie.length ? movie.length : ""} onChange={changeNewEdit}/>
                            </label>

                        </div>
                   
                        <div className="second-column h-100">

                            <label>description: 
                                <textarea id="description" className="edit-details-textarea" defaultValue={movie.description ? movie.description : ""} onChange={changeNewEdit}/>
                            </label>

                        </div>

                        <div className="form-grid-button-container d-flex gap-3">

                            <button className="btn variable-colour border-shadow align-self-center" onClick={closeEdit}>close</button>

                            <button className="btn variable-colour border-shadow align-self-center" onClick={updateMovieDetails}>update</button>

                        </div>

                    </div>

                </div>
            
            }

        </div>
    )
}

export default MovieEditDetails