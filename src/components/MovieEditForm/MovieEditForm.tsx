import './MovieEditForm.css'
import { useState } from 'react';
import MovieEditDetails from '../MovieEditDetails/MovieEditDetails'
import { type MovieDownloadNew } from '../../Types/Types';





// type MovieDownload = {
//     id: string,
//     title: string,
//     url: string,
//     genre: string,
// };

type MovieEditProps = {
    allMovies: MovieDownloadNew[];
    showMovieEditForm: React.Dispatch<React.SetStateAction<boolean>>
    setAllMovies: React.Dispatch<React.SetStateAction<MovieDownloadNew[]>>;
}

const MovieEditForm: React.FC<MovieEditProps> = ({allMovies, showMovieEditForm, setAllMovies}) => {

    const [movieDetails, showMovieDetails] = useState<MovieDownloadNew | null>(null);

   

    const stopMenuClosure = (e: React.MouseEvent) => {

        e.stopPropagation()

        showMovieEditForm(false);
    }


    const setMovieDetails = (movie: MovieDownloadNew) => {

        showMovieDetails(movie)
    }

 

    return(

        <div className="movie-edit-form border-shadow container-style d-flex flex-column justify-content-around align-items-center">

            <div className="map-container d-flex flex-column justify-content-center align-items-center gap-1">
            
                {allMovies.map((movie: MovieDownloadNew, index: number) => {

                    return (

                    

                        <div key={index} className="record-container" onClick={() => setMovieDetails(movie)}>

                            <span className="edit-field-item">{movie.id}</span>
                            <span className="edit-field-item">{movie.title}</span>
                            <span className="edit-field-item">{movie.genre}</span>
                            <span className="edit-field-item flex-fill">{`${movie.timestamp}`}</span>

                        </div>

                        
                    

                    )
                })}

                {movieDetails &&
                    
                    <div className="movie-edit-container border-shadow container-style">

                        <MovieEditDetails movie={movieDetails} setAllMovies={setAllMovies} showMovieDetails={showMovieDetails}/>

                    </div>

                }

            </div>

            <button className="edit-form-button btn border-shadow variable-colour" onClick={stopMenuClosure}>close</button>

        </div>


    )
}

export default MovieEditForm