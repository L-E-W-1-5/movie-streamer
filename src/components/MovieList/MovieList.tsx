import './MovieList.css';
//import { fakeFilms } from '../../assets/FakeFilms.tsx'
import MovieCard from '../MovieCard/MovieCard.tsx';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext.ts';

//TODO: url change 
const url = 'http://localhost:3001';
//const url = 'https://movie-streamer-backend.onrender.com'



type MovieDownload = {
    title: string,
    url: string,
    genre: string
    id: string
}

type MovieListProps = {
    allMovies: Array<MovieDownload>,
    setMovieUrl: React.Dispatch<React.SetStateAction<MovieDownload>>
    setAllMovies: React.Dispatch<React.SetStateAction<MovieDownload[]>>
}

const MovieList: React.FC<MovieListProps> = ({setMovieUrl, allMovies, setAllMovies }) => {

    const { user } = useContext(UserContext)

    const [loading, setLoading] = useState<boolean>(false);

      useEffect(() => {

        const fetchAllMovies = async () => {

            setLoading(true);

            if(!user?.token){

                return;
            }

            try{

                const res = await fetch(`${url}/movies`, {

                    mode: 'cors',

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`
                    }
                });

                const movies = await res.json() as {
                    payload: MovieDownload[];
                    status: string;
                };

                if(res.ok && movies.status !== "error") {

                    setAllMovies(movies.payload);
            
                }else{

                    alert(`${movies.status}: failed to get movies or no movies in the database at this time`);//${movies.payload}
                };
        
            }catch(err){

                console.log(err);
            
            }finally{
                
                setLoading(false);
            }
        };

        fetchAllMovies();

    }, [user, setAllMovies]);


    return (
        <>
            <div className="movie-list-container d-flex flex-row flex-wrap p-2 gap-2 w-100">

            {allMovies && 
                <>

                    {allMovies.map((film:MovieDownload, x:number) => {

                        return <MovieCard key={x} film={film} setMovieUrl={setMovieUrl}/>

                    })}

                </>
            }  


            </div>


            {loading && 

                <div className='loading-animation'>
                
                    <h1>LOADING...</h1>
                
            </div>}

        </>
    )
};

export default MovieList