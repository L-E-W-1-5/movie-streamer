import { useRef, useState, useEffect } from 'react';
import { type Series, type MovieDownloadNew, type MovieUrl } from '../../Types/Types'
import MovieCard from '../MovieCard/MovieCard';
import './SeriesDetails.css'


type SeriesDetailsProps = {
    series: Series
    showSeriesDetails: React.Dispatch<React.SetStateAction<boolean>>
    setSignedUrl: React.Dispatch<React.SetStateAction<MovieUrl>>
    allMedia: MovieDownloadNew[]
}


export const SeriesDetails: React.FC<SeriesDetailsProps> = ({ series, showSeriesDetails, setSignedUrl, allMedia }) => {

    const imageRef = useRef<HTMLImageElement | null>(null);

    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

    const [seasons, setSeasons] = useState<number[]>([])

    const [seriesEpisodes, setSeriesEpisodes] = useState<MovieDownloadNew[]>([])
    
    //TODO: get all episodes by series id (once series_id added to media table)
    //THEN sort by season etc..
    //maybe have this and the seasons set inside a useEffect

    console.log(series, allMedia)

    useEffect(() => {

        if(imageRef.current && series.images && series.images[0].url){

                let cardSelected = false;

                series.images.forEach(image => {

                    if(image.usage === 'series-container'){

                        imageRef.current?.style.setProperty("background-image", `url(${image.url})`) //, "important"

                        cardSelected = true;
                    
                        return;
                    };

                });

                if(cardSelected === false){

                    console.log("fallback", series.title)   
                    
                    if(series.images[0].url){

                        imageRef.current.style.setProperty("background-image", `url(${series.images[0].url})`) 
                    }

                };

        };

        const seriesEpisodes = allMedia.filter(episode => episode.series_id === series.id)
                                       
            
        const seriesSeasons = [...new Set(seriesEpisodes.map(episode => episode.season_number)
                                        .filter((season): season is number => season !== null && season !== undefined)
                                        .sort((a, b) => a - b)
                                    )]

        setSeasons(seriesSeasons)

        setSeriesEpisodes(seriesEpisodes)


    }, [series, allMedia])



    return(

        <div className="series-details-container border-shadow">
                
                <div className="d-flex flex-column align-items-center justify-content-between h-100 w-100">

                    <img className="series-details-image" ref={imageRef}></img>

                    <h5>{series.title}</h5>

                    <select onChange={(e) => setSelectedSeason(Number(e.target.value))}>

                        <option value="">Select Season</option>

                        {seasons.map((season) => (

                            <option key={season} value={season}>

                                Season {season}

                            </option>
                        ))}

                    </select>

                    <div className="series-episodes-container d-flex"> 

                        {seriesEpisodes
                        
                            .filter((episode) => episode.season_number === selectedSeason)

                            .map((episode: MovieDownloadNew, x: number) => {

                                return <MovieCard key={x} film={episode} setSignedUrl={setSignedUrl}/>
                                                
                            })
                        }

                    </div>

                    <div className="movie-details-button-container d-flex gap-4 mb-2">

                        <button className="movie-details-button border-shadow" onClick={() => showSeriesDetails(false)}>Close</button>
            
                    </div>

                </div>

            </div>

    )
}

export default SeriesDetails;