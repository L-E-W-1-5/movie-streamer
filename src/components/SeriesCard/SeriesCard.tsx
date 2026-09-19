import './SeriesCard.css'
import { useRef, useState, useEffect } from 'react'
import { type MovieDownloadNew, type MovieUrl, type Series } from '../../Types/Types' 
import SeriesDetails from '../SeriesDetails/SeriesDetails'

interface SeriesCardProps {
    key: number,
    series: Series,
    setSignedUrl: React.Dispatch<React.SetStateAction<MovieUrl>>,
    allMedia: MovieDownloadNew[]
}

const SeriesCard: React.FC<SeriesCardProps> = ({ series, setSignedUrl, allMedia }) => {

    const cardRef = useRef<HTMLDivElement | null>(null);

    const cardContainerRef = useRef<HTMLDivElement | null>(null);

    const [seriesDetails, showSeriesDetails] = useState<boolean>(false);

    useEffect(() => {

        if(cardRef.current && series.images && series.images[0].url){

                let cardSelected = false;

                series.images.forEach(image => {

                    if(image.usage === 'series-card'){

                        cardRef.current?.style.setProperty("background-image", `url(${image.url})`) //, "important"

                        cardSelected = true;
                    
                        return;
                    };

                });

                if(cardSelected === false){

                    console.log("fallback", series.title)   
                    
                    if(series.images[0].url){

                        cardRef.current.style.setProperty("background-image", `url(${series.images[0].url})`) 
                    }

                    //TODO: save a default image to be used for cards with no image
                    // }else{

                    //     cardRef.current.textContent = series.title;
                    // }

                };

        };

    }, [series]);



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
       
            <SeriesDetails series={series} showSeriesDetails={showSeriesDetails} setSignedUrl={setSignedUrl} allMedia={allMedia}/>    
        
        }

    </>
    )
}

export default SeriesCard