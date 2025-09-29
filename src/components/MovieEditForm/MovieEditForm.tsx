import './MovieEditForm.css'
import { UserContext } from '../../UserContext';
import { useContext } from 'react';


//TODO: url change 
const url = 'http://localhost:3001';
//const url = 'https://movie-streamer-backend.onrender.com'


type MovieDownload = {
    id: string,
    title: string,
    url: string,
    genre: string,
};

type MovieEditProps = {
    allMovies: MovieDownload[];
    showMovieEditForm: React.Dispatch<React.SetStateAction<boolean>>
    setAllMovies: React.Dispatch<React.SetStateAction<MovieDownload[]>>;
}

const MovieEditForm: React.FC<MovieEditProps> = ({allMovies, showMovieEditForm, setAllMovies}) => {


    const { user } = useContext(UserContext);

    const stopMenuClosure = (e: React.MouseEvent) => {

        e.stopPropagation()

        showMovieEditForm(false);
    }

    const handleMovieOptions = async (movie: MovieDownload) => {

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


            if(res.ok){

                const result = await res.json();

                console.log(result);

                setAllMovies(prevMovies => prevMovies.filter(m => m.id !== movie.id))
            }


        }catch(err){

            console.log(err);
        }
    }

    return(

        <div className="movie-edit-form border-shadow container-style d-flex flex-column justify-content-around align-items-center">

            <div className="map-container d-flex flex-column justify-content-start align-items-center">
            
                {allMovies.map((movie: MovieDownload, index: number) => {

                    return (

                        <div key={index} className="record-container d-flex flex-row" onClick={() => handleMovieOptions(movie)}>

                            <span className="edit-field-item">{movie.id}</span>
                            <span className="edit-field-item">{movie.title}</span>
                            <span className="edit-field-item">{movie.genre}</span>
                            <span className="edit-field-item flex-fill">{movie.url}</span>

                        </div>
                    )
                })}

            </div>

            <button className="edit-form-button btn border-shadow variable-colour" onClick={stopMenuClosure}>close</button>

        </div>
    )
}

export default MovieEditForm