import './MovieEditForm.css'
import { useState, useEffect, useRef } from 'react';
import MovieEditDetails from '../MovieEditDetails/MovieEditDetails'
import SeriesEditDetails from '../SeriesEditDetails/SeriesEditDetails';
import { type MovieDownloadNew, type Series } from '../../Types/Types';
import { WindowFocus } from '../WindowFocus/WindowFocus';
import { MediaFormNavbar } from '../MediaFormNavbar/MediaFormNavbar';
//import { url } from '../../Url'
//import { UserContext } from '../../UserContext';



// type MovieDownload = {
//     id: string,
//     title: string,
//     url: string,
//     genre: string,
// };

type MovieEditProps = {
    allMovies: MovieDownloadNew[];
    //showMovieEditForm: React.Dispatch<React.SetStateAction<boolean>>
    setAllMovies: React.Dispatch<React.SetStateAction<MovieDownloadNew[]>>;
    allSeries: Series[];
    setAllSeries: React.Dispatch<React.SetStateAction<Series[]>>
    setOpenForm: React.Dispatch<React.SetStateAction<string | null>>;
}

export type MediaType = MovieDownloadNew | Series;


const MovieEditForm: React.FC<MovieEditProps> = ({ setOpenForm, allMovies, setAllMovies, allSeries, setAllSeries}) => {

    const [allMedia, setAllMedia ] = useState<MediaType[]>([]);

    const [filteredList, setFilteredList] = useState<MediaType[]>([]) 
  
    const scrollRef = useRef<HTMLDivElement>(null);

    const [movieEditContainer, setMovieEditContainer] = useState<{
        media: MovieDownloadNew,
        position: {
            top: number,
            left: number
        }
        } | null>(null);

    const [seriesEditContainer, setSeriesEditContainer] = useState<{
        series: Series,
        position: {
            top: number,
            left: number
        }
    } | null>(null);




    useEffect(() => {

        setAllMedia([
            ...allMovies,
            ...allSeries
        ])

        setFilteredList([
            ...allMovies,
            ...allSeries
        ])

        

    }, [allMovies, allSeries, setAllMedia])



   
    useEffect(() => {

        if(!scrollRef.current) return;

        if(movieEditContainer || seriesEditContainer){

            scrollRef.current.style.setProperty("overflow-y", "hidden", "important")
            
        }else{

            scrollRef.current.style.setProperty("overflow-y", "scroll", "important")
        }

    }, [movieEditContainer, seriesEditContainer, allMovies, allSeries])

    

    const stopMenuClosure = (e: React.MouseEvent) => {

        e.stopPropagation()

        setOpenForm(null)
    }


    const getContainerPosition = (e: React.MouseEvent) => {

        const screenHeight = window.innerHeight;

        const containerPosition = e.currentTarget.closest('.movie-edit-form')?.getBoundingClientRect();

        const scrollContainerTop = e.currentTarget.closest('.movie-edit-form')?.scrollTop || 0;

        const top = scrollContainerTop - (containerPosition?.top || 0) + (screenHeight > 600 ? 350 : 200);

        return top;
    };


    const setMovieForm = (movie: MovieDownloadNew, top: number) => {

        setMovieEditContainer({
            media: movie,
            position: { 
                top: top,
                left: 100
            }
        })
    };


    const setSeriesForm = (series: Series, top: number) => {

        setSeriesEditContainer({
            series,
            position: {
                top: top,
                left: 100
            }
        })
    }

    const setMediaForm = (media: MediaType, e: React.MouseEvent) => {

        e.stopPropagation();

        const top = getContainerPosition(e)

        if("media_format" in media){

            setMovieForm(media, top)
        
        }else{

            setSeriesForm(media, top)
        }
    }


 

    return(

    <>

        <div className="movie-edit-form border-shadow container-style d-flex flex-column align-items-center"
            ref={scrollRef}
        >

        {allMedia && filteredList && <MediaFormNavbar setFilteredList={setFilteredList} filteredList={filteredList} allMedia={allMedia}/>}

            <div className="map-container d-flex flex-column align-items-center gap-1">


                {filteredList && filteredList.map((media: MediaType, index: number) => {

                    const isMovie = "media_format" in media;

                    return(

                        <div key={index} className="d-flex flex-column justify-content-center align-items-center gap-1 w-100">
           
                            <div className="record-container flex-row"
                            onClick={(e) => setMediaForm(media, e)}
                            >

                                <div className="record-container-part1 d-flex flex-column p-2 mb-2">

                                    <span className="edit-field-item">{media.id}</span>
                                    <span className="edit-field-item">{media.title}</span>
                                    <span className="edit-field-item">{media.genre}</span>
                                    { isMovie && <span className="edit-field-item flex-fill">{new Date(media.timestamp).toLocaleString("en-GB", {timeStyle: 'short', dateStyle: 'short'})}</span>}

                                </div>

                                <div className="record-container-part2 d-flex justify-content-center align-items-center">
                                    <h3>{isMovie ? media.media_format === "movie" ? "Movie" : "Episode" : "Series"}</h3>
                                </div>

                            </div>

                            {isMovie && movieEditContainer?.media === media &&
                    
                                 <WindowFocus level={2}>

                                        <MovieEditDetails movie={media} setAllMovies={setAllMovies} setMovieEditContainer={setMovieEditContainer}/>
                                    
                                 </WindowFocus>

                            }

                            {!isMovie && seriesEditContainer?.series === media &&

                                <WindowFocus level={2}>

                                    <div className="media-edit-container">       
                            
                                        <SeriesEditDetails series={media} setAllSeries={setAllSeries} allMedia={allMovies} setAllMovies={setAllMovies} setSeriesEditContainer={setSeriesEditContainer}></SeriesEditDetails>
                            
                                    </div>

                                </WindowFocus>
                            }

                        </div>
                    )
                })}
                

            </div>

            
            <div className="media-form-footer">

                <button className="button-media-form button-style border-shadow" onClick={stopMenuClosure}>
                    close
                </button>

            </div>
            {/* <button onClick={sortImages}>sort images</button> */}

        </div>

        

    </>
    )
}

export default MovieEditForm



            // for(let i = 0; i < movie.images.length; i++){

            //     if(i === 0 && !hasCard){

            //         movie.images[i].usage = 'card';

            //         formData.append('imagesUp[]', movie.images[i].key);

            //         formData.append(movie.images[i].key, 'card')
            //     }
            //     if(i === 1 && !hasContainer){

            //         movie.images[i].usage = 'container';

            //         formData.append('imagesUp[]', movie.images[i].key);

            //         formData.append(movie.images[i].key, 'container')
            //     }
            // }




            
    // const sortImages = async () => {

    //     const formData = new FormData();


    //     allMovies.forEach(movie => {

    //         if(!movie.images) return;

    //         movie.images.forEach((image, index) => {

    //             if(image.usage === 'card'){

    //                 console.log(image.original_name, image.usage, "skipped")

    //                 formData.append('imagesUp', String(image.id));

    //                 formData.append(String(image.id), 'card')

    //                 return;
    //             };

    //             if(image.usage === 'container'){

    //                 console.log(image.original_name, image.usage, "skipped cont.")

    //                 formData.append('imagesUp', String(image.id));

    //                 formData.append(String(image.id), 'container')

    //                 return;
    //             } 

    //             if(index === 0){

    //                 image.usage = 'card';

    //                 console.log(image.original_name, image.usage, "updated")

    //                 formData.append('imagesUp', String(image.id));

    //                 formData.append(String(image.id), 'card')

    //                 return;
    //             }

    //             if(index === 1){

    //                 image.usage = 'container';

    //                 console.log(image.original_name, image.usage, "updated")

    //                 formData.append('imagesUp', String(image.id));

    //                 formData.append(String(image.id), 'container')

    //                 return;
    //             }

    //             if(!image.usage || image.usage === 'other'){

    //                 image.usage = "other";

    //                 console.log(image.original_name, image.usage, "other")

    //                 formData.append('imagesUp', String(image.id));

    //                 formData.append(String(image.id), 'other')

    //             } 
    //         })
            
    //     });

    //     console.log(formData);

    //     try{

    //         const res = await fetch(`${url}/movies/update_image`, {

    //             method: 'POST',

    //             headers: {

    //                 'authorization': `Bearer ${user?.token}`
    //             },

    //             body: formData
    //         });

    //         const response = await res.json();

    //         console.log(response)

    //         if(res.ok && response.status === "success"){

    //             // -- set allMovies here

    //             console.log(response.payload);
    //         }
        
    //     }catch(err){

    //         console.log(err)
    //     }
    // }



    {/* {allMovies.map((movie: MovieDownloadNew, index: number) => {

                    return (

                    <div key={index} className="d-flex flex-column justify-content-center align-items-center gap-1 w-100">
           
                        <div className="record-container flex-row"
                        onClick={(e) => setMovieForm(movie, e)}
                        >
                        
                            <div className="record-container-part1 d-flex flex-column p-2 mb-2">

                                <span className="edit-field-item">{movie.id}</span>
                                <span className="edit-field-item">{movie.title}</span>
                                <span className="edit-field-item">{movie.genre}</span>
                                <span className="edit-field-item flex-fill">{new Date(movie.timestamp).toLocaleString("en-GB", {timeStyle: 'short', dateStyle: 'short'})}</span>

                            </div>

                            <div className="record-container-part2 d-flex justify-content-center align-items-center">
                                <h3>Movie</h3>
                            </div>

                        </div>

                        {movieEditContainer?.media === movie &&
                    
                                 <WindowFocus level={2}>

                                        <MovieEditDetails movie={movie} setAllMovies={setAllMovies} setMovieEditContainer={setMovieEditContainer}/>
                                    
                                 </WindowFocus>

                        }

                        
                    
                    </div>

                    )
                })}

                {allSeries.map((series: Series, index: number) => {
                    
                    return (
                    
                        <div key={index} className="d-flex flex-column justify-content-center align-items-center gap-1 w-100">

                            <div className="record-container flex-row"
                            onClick={(e) => setSeriesForm(series, e)}
                            >

                                <div className="record-container-part1 d-flex flex-column p-2 mb-2">

                                    <span className="edit-field-item">{series.id}</span>
                                    <span className="edit-field-item">{series.title}</span>
                                    <span className="edit-field-item">{series.genre}</span>

                                </div>

                                <div className="record-container-part2 d-flex h-100 justify-content-center align-items-center">
                                
                                    <h3>Series</h3>
                            
                                </div>

                        </div>


                            {seriesEditContainer?.series === series &&

                                <WindowFocus level={2}>

                                    <div className="media-edit-container">       
                            
                                        <SeriesEditDetails series={series} setAllSeries={setAllSeries} allMedia={allMovies} setAllMovies={setAllMovies} setSeriesEditContainer={setSeriesEditContainer}></SeriesEditDetails>
                            
                                    </div>

                                </WindowFocus>
                            }

                        </div>

                    )
                })} */}