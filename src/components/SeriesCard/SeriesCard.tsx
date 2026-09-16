import './SeriesCard.css'
import { useRef, useState } from 'react'
import { type MovieUrl, type Series } from '../../Types/Types' 
import SeriesDetails from '../SeriesDetails/SeriesDetails'

interface SeriesCardProps {
    key: number,
    series: Series,
    setSignedUrl: React.Dispatch<React.SetStateAction<MovieUrl>>
}

const SeriesCard: React.FC<SeriesCardProps> = ({ series, setSignedUrl }) => {

    const cardRef = useRef<HTMLDivElement | null>(null);

    const cardContainerRef = useRef<HTMLDivElement | null>(null);

    const [seriesDetails, showSeriesDetails] = useState<boolean>(false);


    return (
    <>

        <div className='movie-card-container user-select-none d-flex flex-column mt-1 ' 
        ref={cardContainerRef} 
        onClick={() => showSeriesDetails(current => !current)}>

            <div className="movie-card p-2" ref={cardRef}/> 

            <div className="movie-card-headings">

                <h5 className="movie-card-title user-select-none">{series.title}</h5>


            </div>


        </div>


        {seriesDetails &&
       
            <SeriesDetails series={series} showSeriesDetails={showSeriesDetails} setSignedUrl={setSignedUrl}/>    
        
        }

    </>
    )
}

export default SeriesCard