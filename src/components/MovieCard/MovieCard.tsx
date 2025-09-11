import './MovieCard.css'


interface MovieInfo {
    name: string,
    url: string,
    genre: string,
    setMovieUrl: React.Dispatch<React.SetStateAction<string>>
}

const MovieCard: React.FC<MovieInfo> = ({name, url, genre, setMovieUrl}) => {

    return(

        <div className="movie-card border-shadow card p-2" onClick={() => setMovieUrl(url)}>

            <h3>{name}</h3>

            <p>{genre}</p>

        </div>
    )
}

export default MovieCard;