import { useContext } from 'react'
import { UserContext } from '../../UserContext';
import { type MovieDownloadNew } from '../../Types/Types';
import { url } from '../../Url';


//TODO: url change 
//const url = 'http://localhost:3001';
//const url = 'https://movie-streamer-backend.onrender.com'

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



const MovieEditDetails: React.FC<MovieDetailsProps> = ({movie, setAllMovies, showMovieDetails}) => {

    const { user } = useContext(UserContext);


    const handleMovieOptions = async () => {

        console.log(movie);
    
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

    const closeForm = (e: React.MouseEvent<HTMLButtonElement>) => {

        e.stopPropagation()

        showMovieDetails(null);
    }




    return(

        <div className="d-flex flex-column justify-content-around align-items-center h-100 w-100">

            <h4>{movie.title}</h4>
            <span>{movie.genre}</span>
            <span>{movie.description}</span>
            <span>{movie.year}</span>
            <span>{`${movie.timestamp}`}</span>
            <span>{movie.times_played}</span>

            <div className="d-flex flex-row gap-5">

                <button className="btn border-shadow variable-colour" onClick={handleMovieOptions}>delete</button>

                <button className="btn border-shadow variable-colour" onClick={closeForm}>close</button>

            </div>
            

        </div>
    )
}

export default MovieEditDetails