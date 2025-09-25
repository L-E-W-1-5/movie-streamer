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
    id: string
}

type MovieListProps = {
    downloadedMovies: Array<MovieDownload>,
    setMovieUrl: React.Dispatch<React.SetStateAction<MovieDownload>>
}

const MovieList: React.FC<MovieListProps> = ({downloadedMovies, setMovieUrl}) => {




    return (
        <div className="movie-list-container d-flex flex-row flex-wrap p-2 gap-2 w-100">

            {downloadedMovies.map((film:MovieDownload, x:number) => {

                return <MovieCard key={x} film={film} setMovieUrl={setMovieUrl}/>

            })}


        </div>
    )
};

export default MovieList