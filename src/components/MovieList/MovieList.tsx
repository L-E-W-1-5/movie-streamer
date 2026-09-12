import './MovieList.css';
//import { fakeFilms } from '../../assets/FakeFilms.tsx'
import MovieCard from '../MovieCard/MovieCard.tsx';
import SeriesCard from '../SeriesCard/SeriesCard.tsx';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext.ts';
import { type MovieUrl, type MovieDownloadNew, type Series } from '../../Types/Types.ts';
import { url } from '../../Url';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';



// type MovieDownload = {
//     title: string,
//     url: string,
//     genre: string
//     id: string
// }

type MovieListProps = {
    allMovies: Array<MovieDownloadNew>;
    setAllMovies: React.Dispatch<React.SetStateAction<MovieDownloadNew[]>>;
    setSignedUrl: React.Dispatch<React.SetStateAction<MovieUrl>>;
    messageSlide: boolean;
}

const MovieList: React.FC<MovieListProps> = ({ allMovies, setAllMovies, setSignedUrl, messageSlide }) => {

    const { user } = useContext(UserContext)

    const [loading, setLoading] = useState<boolean>(false);

    const [allSeries, setAllSeries] = useState<Series[]>([]);


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
                    payload: MovieDownloadNew[];
                    status: string;
                };


                if(res.ok && movies.status !== "error"){

                    const mediaData = movies.payload

                    setAllMovies(mediaData);

                    const groupedSeries = Object.values(mediaData.filter(film => film.media_format === "series")
                                                            .reduce((groups, episode) => {

                                                                const title = episode.title;

                                                                if(!groups[title]){

                                                                    groups[title] = {
                                                                        title: episode.title,
                                                                        episodes: []
                                                                    }
                                                                }

                                                                groups[title].episodes.push(episode);

                                                                return groups;

                                                            }, {} as Record<string, Series>)
                                                        );
                                                        
                    setAllSeries(groupedSeries);

                                                    
            
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

        <div className="dashboard-movie-container border-shadow" style={{display: messageSlide ? "none" : "block"}}>

            <div className="movie-list-container d-flex flex-row flex-wrap p-2 gap-2 w-100">

                {allMovies && 
                    <>

                        {allMovies.map((film:MovieDownloadNew, x:number) => {
//TODO: add logic to swap between series and movies based on media format
//TODO: add demop media for demo account to be shown here
                        // if(user?.username === "demo account"){
                        //    if(film.description === "demo media"){
                        //         return <MovieCard key={x} film={film} setSignedUrl={setSignedUrl}/>
                        //     }
                        // }else{
                        //

                            if(film.media_format === "movie"){ // & state says movies once i have tabs

                                return <MovieCard key={x} film={film} setSignedUrl={setSignedUrl}/>
                            }

                        })}

                        {allSeries.map((series: Series, x: number) => {

                            return <SeriesCard key={x} series={series} setSignedUrl={setSignedUrl}/>
                        })}

                    </>
                }  

            </div>


            {loading && 

                <LoadingAnimation/>

                }

        </div>
    )
};

export default MovieList


// <div className='loading-animation'>
                
//                     <h1>LOADING...</h1>
                
//             </div>