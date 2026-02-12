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

   

    const stopMenuClosure = (e: React.MouseEvent) => {

        e.stopPropagation()

        setOpenForm(null)

        //showMovieEditForm(false);
    }


    // const setMovieDetails = (movie: MovieDownloadNew) => {

    //     showMovieDetails(movie)
    // }


    const setEditForm = (movie: MovieDownloadNew, e: React.MouseEvent) => {

        console.log(e.currentTarget.closest('movie-edit-form'))

        const containerPosition = e.currentTarget.closest('.movie-edit-form')?.getBoundingClientRect();

        const scrollContainerTop = e.currentTarget.closest('.movie-edit-form')?.scrollTop || 0;

        const top = scrollContainerTop - (containerPosition?.top || 0) + 350

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

        <div className="movie-edit-form border-shadow container-style d-flex flex-column justify-content-around align-items-center">

            <div className="map-container d-flex flex-column justify-content-center align-items-center gap-1">
            
                {allMovies.map((movie: MovieDownloadNew, index: number) => {

                    return (

                    

                        <div key={index} className="record-container border-shadow p-2 mb-2" onClick={(e) => setEditForm(movie, e)}>

                            <span className="edit-field-item">{movie.id}</span>
                            <span className="edit-field-item">{movie.title}</span>
                            <span className="edit-field-item">{movie.genre}</span>
                            <span className="edit-field-item flex-fill">{`${movie.timestamp}`}</span>

                        </div>

                        
                    

                    )
                })}

                

            </div>

            {movieEditContainer &&
                    
            <div className="movie-edit-container border-shadow container-style" style={{top: movieEditContainer.position.top}}>

                <MovieEditDetails movie={movieEditContainer.movie} setAllMovies={setAllMovies} setMovieEditContainer={setMovieEditContainer}/>

            </div>

        }

            <button className="button-style border-shadow" onClick={stopMenuClosure}>close</button>

        </div>

        

    </>
    )
}

export default MovieEditForm