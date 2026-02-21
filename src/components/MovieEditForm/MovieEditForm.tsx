import './MovieEditForm.css'
import { useState, useEffect, useRef } from 'react';
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
    //showMovieEditForm: React.Dispatch<React.SetStateAction<boolean>>
    setAllMovies: React.Dispatch<React.SetStateAction<MovieDownloadNew[]>>;
    setOpenForm: React.Dispatch<React.SetStateAction<string | null>>;
}

const MovieEditForm: React.FC<MovieEditProps> = ({ setOpenForm, allMovies, setAllMovies}) => {

    //const [movieDetails, showMovieDetails] = useState<MovieDownloadNew | null>(null);

    const [movieEditContainer, setMovieEditContainer] = useState<{
        movie: MovieDownloadNew,
        position: {top: number,
                    left: number;}
        } | null>(null);

        const scrollRef = useRef<HTMLDivElement>(null);

   

        useEffect(() => {

            if(!scrollRef.current) return;

            if(movieEditContainer){

                scrollRef.current.style.setProperty("overflow-y", "hidden", "important")
            
            }else{

                scrollRef.current.style.setProperty("overflow-y", "scroll", "important")
            }

        }, [movieEditContainer])

    const stopMenuClosure = (e: React.MouseEvent) => {

        e.stopPropagation()

        setOpenForm(null)

        //showMovieEditForm(false);
    }


    // const setMovieDetails = (movie: MovieDownloadNew) => {

    //     showMovieDetails(movie)
    // }


    const setEditForm = (movie: MovieDownloadNew, e: React.MouseEvent) => {

        e.stopPropagation();

        const screenHeight = window.innerHeight;

        const containerPosition = e.currentTarget.closest('.movie-edit-form')?.getBoundingClientRect();

        const scrollContainerTop = e.currentTarget.closest('.movie-edit-form')?.scrollTop || 0;

        const top = scrollContainerTop - (containerPosition?.top || 0) + (screenHeight > 600 ? 350 : 200);

        setMovieEditContainer({
            movie,
            position: { 
                top: top,
                left: 100
            }
        })
    }

 

    return(

    <>

        <div className="movie-edit-form border-shadow container-style d-flex flex-column justify-content-around align-items-center"
            ref={scrollRef}
        >

            <div className="map-container d-flex flex-column justify-content-center align-items-center gap-1">
            
                {allMovies.map((movie: MovieDownloadNew, index: number) => {

                    return (

                    <div key={index} className="d-flex flex-column justify-content-center align-items-center gap-1 w-100">
           
                    

                        <div className="record-container border-shadow p-2 mb-2" onClick={(e) => setEditForm(movie, e)}>

                            <span className="edit-field-item">{movie.id}</span>
                            <span className="edit-field-item">{movie.title}</span>
                            <span className="edit-field-item">{movie.genre}</span>
                            <span className="edit-field-item flex-fill">{`${movie.timestamp}`}</span>

                        </div>

                        {movieEditContainer?.movie === movie &&
                    
                            <div className="movie-edit-container" style={{top: movieEditContainer.position.top}}>

                                <MovieEditDetails movie={movie} setAllMovies={setAllMovies} setMovieEditContainer={setMovieEditContainer}/>

                            </div>

                        }
                    
                    </div>

                    )
                })}

                

            </div>

            

            <button className="button-min-height button-style border-shadow" onClick={stopMenuClosure}>close</button>

        </div>

        

    </>
    )
}

export default MovieEditForm