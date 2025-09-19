import './MovieList.css';
//import { fakeFilms } from '../../assets/FakeFilms.tsx'
import MovieCard from '../MovieCard/MovieCard.tsx';

// type Film = {
//     title: string,
//     url: string,
//     genre: string
// }

type MovieDownload = {
    title: string,
    url: string,
    genre: string
    
}

type MovieListProps = {
    downloadedMovies: Array<MovieDownload>,
    setMovieUrl: React.Dispatch<React.SetStateAction<string>>
}

const MovieList: React.FC<MovieListProps> = ({downloadedMovies, setMovieUrl}) => {




    return (
        <div className="movie-list-container d-flex flex-row justify-content-start p-2 gap-2 flex-wrap">

            {downloadedMovies.map((film:MovieDownload, x:number) => {

                return <MovieCard key={x} name={film.title} url={film.url} genre={film.genre} setMovieUrl={setMovieUrl}/>

            })}


        </div>
    )
};

export default MovieList