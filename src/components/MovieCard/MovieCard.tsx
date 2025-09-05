import './MovieCard.css'


interface MovieInfo {
    title: string,
    movieFile: string
}

const MovieCard: React.FC<MovieInfo> = ({title, movieFile}) => {

    return(

        <div className="movie-card border-shadow card p-2">

            <h3>{title}</h3>

            <p>{movieFile}</p>

        </div>
    )
}

export default MovieCard;