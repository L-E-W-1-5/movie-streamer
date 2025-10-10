import {  useContext } from "react"
import { UserContext } from "../../UserContext";




//TODO: url change 
const url = 'http://localhost:3001';
//const url = 'https://movie-streamer-backend.onrender.com'

type MovieDownload = {
    title: string,
    url: string,
    genre: string
    id: string
}

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
    film:MovieDownload
    setMovieUrl: React.Dispatch<React.SetStateAction<MovieDownload>>
}

const MovieDetails:React.FC<MovieDetailsProps> = ({film, setMovieUrl}) => {

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

            console.log(response.payload)

            setMovieUrl(response.payload)
        
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

            <h3>{film.title}</h3>

            <h4>{film.genre}</h4>


            <button onClick={changeUrl}>Play</button>

        </div>

    )
}

export default MovieDetails