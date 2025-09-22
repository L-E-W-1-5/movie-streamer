import './MovieCard.css'

type MovieDownload = {
    title: string,
    url: string,
    genre: string
    
}

interface MovieInfo {
    film:MovieDownload
    setMovieUrl: React.Dispatch<React.SetStateAction<MovieDownload>>
}

const MovieCard: React.FC<MovieInfo> = ({film, setMovieUrl}) => {


    return(

        <div className="movie-card border-shadow card p-2" onClick={() => setMovieUrl(film)}>

            <h3>{film.title}</h3>

            <p>{film.genre}</p>

        </div>
    )
}

export default MovieCard;