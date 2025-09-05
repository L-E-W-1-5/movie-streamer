import './MovieList.css';
import { fakeFilms } from '../../assets/FakeFilms.tsx'
import MovieCard from '../MovieCard/MovieCard.tsx';

type Film = {
    title: string,
    movieFile: string
}

const MovieList = () => {


//TODO: create the fetch for movies here



    return (
        <div className="movie-list-container d-flex flex-row justify-content-start p-2 gap-2 flex-wrap">

            {fakeFilms.map((film:Film, x:number) => {

                return <MovieCard key={x} title={film.title} movieFile={film.movieFile}/>

            })}


        </div>
    )
};

export default MovieList