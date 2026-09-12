import './SeriesCard.css'
//import { useState } from 'react'
import { type MovieDownloadNew, type MovieUrl, type Series } from '../../Types/Types' 
import MovieCard from '../MovieCard/MovieCard'
import { useRef, useState } from 'react'

interface SeriesCardProps {
    key: number,
    series: Series,
    setSignedUrl: React.Dispatch<React.SetStateAction<MovieUrl>>
}

const SeriesCard: React.FC<SeriesCardProps> = ({ series, setSignedUrl }) => {

    const cardRef = useRef<HTMLDivElement | null>(null);

    const imageRef = useRef<HTMLImageElement | null>(null);

    const cardContainerRef = useRef<HTMLDivElement | null>(null);

    const [seriesDetails, showSeriesDetails] = useState<boolean>(false);


    return (
    <>

        <div className='movie-card-container user-select-none d-flex flex-column mt-1' 
        ref={cardContainerRef} 
        onClick={() => showSeriesDetails(current => !current)}>

            {/* card border-radius */}
            <div className="movie-card p-2" ref={cardRef}/> 

            <div className="movie-card-headings">

                <h5 className="movie-card-title user-select-none">{series.title}</h5>


            </div>


        </div>


        {seriesDetails &&
        
           <div className="series-details-container ">
                
                <div className="d-flex flex-column align-items-center justify-content-between h-100 w-100">

                    <img className="series-details-img" ref={imageRef} alt={`${series.title} image`}></img>

                 <div className="series-episodes-container d-flex"> 

                    

                        {series.episodes.map((episode: MovieDownloadNew, x: number) => (

                            <MovieCard key={x} film={episode} setSignedUrl={setSignedUrl}/>
                        ))}

                    </div>

                    <div className="movie-details-button-container d-flex gap-4 mb-2">

                        <button className="movie-details-button border-shadow" onClick={() => showSeriesDetails(false)}>Close</button>
            
                    </div>

                </div>

            </div>
        
        }

    </>
    )
}

export default SeriesCard