import { type MovieDownloadNew, type Series } from "../../Types/Types"
import './SeriesEditDetails.css'
import { useState } from 'react'
import MovieEditDetails from "../MovieEditDetails/MovieEditDetails"


type SeriesEditDetailsProps = {
    series: Series
    setAllSeries: React.Dispatch<React.SetStateAction<Series[]>>
    allMedia: MovieDownloadNew[]
    setAllMovies: React.Dispatch<React.SetStateAction<MovieDownloadNew[]>>
    setSeriesEditContainer: React.Dispatch<React.SetStateAction<{
        series: Series,
        position: {
            top: number,
            left: number
        }
    } | null>>
}

//TODO: complete this component - enjoy :)
// render episodes inside each series rather than on the main list
// create a form to edit the details or images of the series
// create a button to delete the entire series or maybe to delete an individual season?
// use the previous MovieEditDetails form to edit the episodes once clicked

export const SeriesEditDetails: React.FC<SeriesEditDetailsProps> = ({series, setAllSeries, allMedia, setAllMovies, setSeriesEditContainer}) => {

    const [episodeEdit, setEpisodeEdit] = useState<{
        media: MovieDownloadNew,
        position: {
            top: number,
            left: number
        }
    } | null>(null)

    const handleepisodeEditContainer = (episode: MovieDownloadNew, e: React.MouseEvent) => {

        e.preventDefault();
        e.stopPropagation();

        setEpisodeEdit({
            media: episode,
            position: {
                top: 100,
                left: 100
            }
        })

    }

    const editSeriesDetails = () => {

//TODO: finish this function to edit series details/images
        setAllSeries(prev => [...prev])

        console.log(series)
    }

//TODO: add a delete button and function for the entire series and make the backend route.


    return (

        <div className="series-edit-details-container border-shadow">

            <div className="series-edit-details-info">
                <h4>{series.title}</h4>
                <span>{series.genre}</span>
                <span>{series.description}</span>
                <span>{series.year}</span>
            </div>


            <div className="series-edit-container-episode-list">

                {allMedia.filter(x => x.media_format === "series" && x.series_id === series.id)
                .map((episode: MovieDownloadNew, index: number) => {

                    return (

                        <div  key={index} className="d-flex flex-column justify-content-center align-items-center gap-1 w-100">

                            <div className="series-record-container border-shadow p-2 mb-2" onClick={(e) => handleepisodeEditContainer(episode, e)}>

                                <span className="edit-field-item">{episode.id}</span>
                                <span className="edit-field-item">{episode.title}</span>
                                <span className="edit-field-item">{episode.genre}</span>
                                <span className="edit-field-item flex-fill">{`${episode.timestamp}`}</span>

                            </div>

                            {episodeEdit?.media === episode &&
                    
                            <div className="media-edit-container" style={{top: episodeEdit.position.top}}>

                                <MovieEditDetails movie={episode} setAllMovies={setAllMovies} setMovieEditContainer={setEpisodeEdit}/>

                            </div>

                        }

                        </div>
                    )

                })}

            </div>


            <div className="series-edit-details-button-container">

                <button className="button-style border-shadow"
                onClick={editSeriesDetails}
                >             
                    edit
                </button>

                <button className="button-style border-shadow"
                onClick={(e) => {
                    e.stopPropagation()
                    setSeriesEditContainer(null)
                    }}
                >
                    close
                </button>

            </div>

        </div>
    )

}

export default SeriesEditDetails