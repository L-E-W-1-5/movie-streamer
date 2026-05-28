import { useState, useRef, useEffect, useContext } from 'react'
import './MovieCard.css'
import MovieDetails from '../MovieDetails/MovieDetails'
import { type MovieUrl, type MovieDownloadNew } from '../../Types/Types'
import { UserContext } from '../../UserContext'

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

    const cardRef = useRef<HTMLDivElement | null>(null);

    const cardContainerRef = useRef<HTMLDivElement | null>(null);

    const { user } = useContext(UserContext)

    useEffect(() => {

        // if(user?.username === "demo account"){

        //     if(film)

        //         if(cardContainerRef.current){
                    
        //             cardContainerRef.current.style.pointerEvents = "none";

        //             cardContainerRef.current.style.setProperty("opacity", "0.4", "important");

        //             cardContainerRef.current.style.setProperty("filter", "grayscale(1)", "important");


                    
        //              return;
        //         };

        // }

      
        if(cardRef.current && film.images){

            if(film.images[0] && film.images[0].url){

                let cardSelected = false;

                film.images.forEach(image => {

                    if(image.usage === 'card' && cardRef.current){

                        cardRef.current.style.setProperty("background-image", `url(${image.url})`, "important")

                        cardSelected = true;
                    
                        return;
                    };

                });

                if(cardSelected === false){

                    console.log("fallback", film.title)

                    cardRef.current.style.setProperty("background-image", `url(${film.images[0].url})`, "important")
                }

            }

        }

    }, [film, user])



    return(

    <>

        <div className='movie-card-container d-flex flex-column' ref={cardContainerRef} onClick={() => showMovieDetails(current => !current)}>

            <div className="movie-card border-shadow card p-2" ref={cardRef}/> 

            <div className="movie-card-headings">

                <h5 className="movie-card-title">{user?.username === "demo account" ? "restricted" : film.title}</h5>

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