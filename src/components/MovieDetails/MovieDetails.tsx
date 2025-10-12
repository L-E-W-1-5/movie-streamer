import {  useContext } from "react"
import { UserContext } from "../../UserContext";
import { type MovieUrl, type MovieDownloadNew } from "../../Types/Types";
import { url } from '../../Url';
import './MovieDetails.css'



// type MovieDownload = {
//     title: string,
//     url: string,
//     genre: string
//     id: string
// }

// type NewMovieDownload = {   
//     id: number, 
//     title: string,
//     description: string,
//     length: string,
//     year: number,
//     genre: string,
//     timestamp: Date,
//     times_played: number 
// }

interface MovieDetailsProps {
    film: MovieDownloadNew
    closeDetails: React.Dispatch<React.SetStateAction<boolean>>
    setSignedUrl: React.Dispatch<React.SetStateAction<MovieUrl>>
}

const MovieDetails:React.FC<MovieDetailsProps> = ({film, setSignedUrl, closeDetails}) => {

    const { user } = useContext(UserContext)

   // const [movieS3, setMovieS3] = useState()


    const getMovie = async () => {

        try{

            const res = await fetch(`${url}/movies/get_s3`, {

                method: 'POST',

                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${user?.token}`
                },

                body: JSON.stringify({film})
            })

            const response = await res.json()

            setSignedUrl({
                url: response.payload,
                title: film.title
            })

        
        }catch(err){

            console.log(err)
        }
    }


    const changeUrl = () => {

        //setMovieUrl(film)

        getMovie()
    }

     const closeMovieDetails = (e: React.MouseEvent<HTMLButtonElement>) => {

        e.stopPropagation();

        closeDetails(false)
    }



    return(
        
        <div className="movie-play-container d-flex flex-column justify-content-between align-items-center h-100 w-100 p-4">

            <h3>{`${film.title} - ${film.year}`}</h3>

            <h4>{film.genre}</h4>

            <p>{film.description}</p>

            <p>{film.length ? `length: ${film.length}` : ""}</p>

            <div className="d-flex gap-4">

                <button className="btn border-shadow variable-colour mb-3" onClick={changeUrl}>Play</button>

                <button className="btn border-shadow variable-colour mb-3" onClick={closeMovieDetails}>close</button>
            
            </div>


        </div>

    )
}

export default MovieDetails