import { useState } from 'react'
import './MovieCard.css'
import MovieDetails from '../MovieDetails/MovieDetails'
import { type MovieUrl, type MovieDownloadNew } from '../../Types/Types'

// type MovieDownload = {
//     title: string,
//     url: string,
//     genre: string
//     id: string
// }

interface MovieInfo {
    film: MovieDownloadNew
    setSignedUrl: React.Dispatch<React.SetStateAction<MovieUrl>>
}

const MovieCard: React.FC<MovieInfo> = ({film, setSignedUrl}) => {

    const [movieDetails, showMovieDetails] = useState<boolean>(false)



    return(

        <>

        <div className='movie-card-container d-flex flex-column' onClick={() => showMovieDetails(current => !current)}>

            <div className="movie-card border-shadow card p-2">
            </div>

            <div className="movie-card-headings">

                <h3 className="movie-card-title">{film.title}</h3>

                {/* <p>{film.genre}</p> */}

            </div>


        </div>

        {movieDetails && 
        
            <div className='movie-details-container container-style border-shadow d-flex flex-column justify-content-around align-items-center'>


                <MovieDetails film={film} setSignedUrl={setSignedUrl} closeDetails={showMovieDetails}/>


            </div>
        
        }
        
        
        </>
    )
}

export default MovieCard;