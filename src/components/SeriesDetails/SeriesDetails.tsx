import { useRef, useState } from 'react';
import { type Series, type MovieDownloadNew, type MovieUrl } from '../../Types/Types'
import MovieCard from '../MovieCard/MovieCard';


type SeriesDetailsProps = {
    series: Series
    showSeriesDetails: React.Dispatch<React.SetStateAction<boolean>>
    setSignedUrl: React.Dispatch<React.SetStateAction<MovieUrl>>
}


export const SeriesDetails: React.FC<SeriesDetailsProps> = ({ series, showSeriesDetails, setSignedUrl }) => {

    const imageRef = useRef<HTMLImageElement | null>(null);

    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
    
    const seasons = [...new Set(
    
                        series.episodes
    
                        .map(episode => episode.season_number)
    
                        .filter((season): season is number => season !== null && season !== undefined)
    
                        .sort((a, b) => a - b)
                    )];

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

                        {series.episodes
                        
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