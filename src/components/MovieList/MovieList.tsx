import './MovieList.css';
import MovieCard from '../MovieCard/MovieCard.tsx';
import SeriesCard from '../SeriesCard/SeriesCard.tsx';
import { type MovieUrl, type MovieDownloadNew, type MediaType } from '../../Types/Types.ts';



type MovieListProps = {
    allMovies: Array<MovieDownloadNew>;
    // setAllMovies: React.Dispatch<React.SetStateAction<MovieDownloadNew[]>>;
   // allSeries: Series[];
    // setAllSeries: React.Dispatch<React.SetStateAction<Series[]>>
    setSignedUrl: React.Dispatch<React.SetStateAction<MovieUrl>>;
    messageSlide: boolean;
    allMedia: MediaType[];
}

const MovieList: React.FC<MovieListProps> = ({ allMedia, allMovies, setSignedUrl, messageSlide }) => {


    return (

        <div className="dashboard-movie-container border-shadow" style={{display: messageSlide ? "none" : "block"}}>

            <div className="movie-list-container d-flex flex-row flex-wrap p-2 gap-2 w-100">

                {allMedia && 
                
                    allMedia.map((media, index) => {

                        if("media_format" in media && media.media_format === "movie"){

                            return <MovieCard key={index} film={media} setSignedUrl={setSignedUrl}/>
                        }
                        if(!("media_format" in media)){

                            return <SeriesCard key={index} series={media} setSignedUrl={setSignedUrl} allMedia={allMovies}/>
                        }
                    })
                }  

            </div>


            

        </div>
    )
};

export default MovieList


// <div className='loading-animation'>
                
//                     <h1>LOADING...</h1>
                
//             </div>




 // const groupedSeries = Object.values(mediaData.filter(film => film.media_format === "series")
                    //                                         .reduce((groups, episode) => {

                    //                                             const title = episode.title;

                    //                                             if(!groups[title]){

                    //                                                 groups[title] = {
                    //                                                     title: episode.title,
                    //                                                     episodes: []
                    //                                                 }
                    //                                             }

                    //                                             groups[title].episodes.push(episode);

                    //                                             return groups;

                    //                                         }, {} as Record<string, Series>)
                    //                                     );
                                                        
                    // setAllSeries(groupedSeries);







{/* <>

                        {allMovies.map((film:MovieDownloadNew, x:number) => {

//TODO: add logic to swap between series and movies based on media format (with nav button state)
//TODO: add demo media for demo account to be shown here

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

                            return <SeriesCard key={x} series={series} setSignedUrl={setSignedUrl} allMedia={allMovies}/>
                        })}

                    </> */}