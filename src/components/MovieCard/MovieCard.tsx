import { useState, useRef } from 'react'
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

    const cardRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {

    //     if(cardRef.current && film.images && film.images[0]){

    //         console.log(film.images[0].buffer.slice(2), typeof(film.images[0].buffer))

    //         film.images[0].buffer = film.images[0].buffer.slice(2);

    //         const bytes = new Uint8Array(film.images[0].buffer.length / 2)

    //         for(let i = 1; i < bytes.length; i++){

    //             bytes[i] = parseInt(film.images[0].buffer.substring(i * 2, 2), 16);
    //         }

    //         console.log(bytes)

    //         const movieURL = new Blob([bytes], {type: 'image/jpeg'});

    //         const blob = URL.createObjectURL(movieURL)

    //         //const movieBytea = btoa(String.fromCharCode(...new Uint8Array(film.images[0].buffer)));

    //         console.log(blob)

            
    //         if(blob){
                
    //             //console.log(film.images[0].buffer)

    //             //const url = URL.createObjectURL(film.images[0].buffer)

    //             //console.log(url)
                
    //             cardRef.current.style.setProperty("background-image", `url(${blob})` , "important")
    //         }
    //     }

    // }, [film])



    return(

        <>

        <div className='movie-card-container d-flex flex-column' onClick={() => showMovieDetails(current => !current)}>

            <div className="movie-card border-shadow card p-2" ref={cardRef} > 
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

//style={{backgroundImage: film.images && film.images.length > 0 ? URL.createObjectURL(film.images[0].buffer) : ""}}