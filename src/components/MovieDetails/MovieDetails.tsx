import {  useContext } from "react"
import { UserContext } from "../../UserContext";
import { type MovieUrl, type MovieDownloadNew } from "../../Types/Types";
import { url } from '../../Url';



//TODO: url change 
//const url = 'http://localhost:3001';
//const url = 'https://movie-streamer-backend.onrender.com'

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
    setSignedUrl: React.Dispatch<React.SetStateAction<MovieUrl>>
}

const MovieDetails:React.FC<MovieDetailsProps> = ({film, setSignedUrl}) => {

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



    return(
        
        <div className="d-flex flex-column justify-content-between align-items-center h-100 w-100">

            <h3>{`${film.title} - ${film.year}`}</h3>

            <h4>{film.genre}</h4>

            <p>{film.description}</p>


            <button className="btn border-shadow variable-colour mb-3" onClick={changeUrl}>Play</button>

        </div>

    )
}

export default MovieDetails