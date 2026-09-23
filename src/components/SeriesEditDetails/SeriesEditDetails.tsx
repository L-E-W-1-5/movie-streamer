import { type MovieDownloadNew, type Series } from "../../Types/Types"
import './SeriesEditDetails.css'
import { useState, useEffect } from 'react'
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

    const [seriesEditContainer, showSeriesEditContainer] = useState<boolean>(false);

    const [seasons, setSeasons] = useState<number[] | []>([]);

    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);




    useEffect(() => {

        const seasonArray = allMedia.filter(episode => episode.series_id === series.id)
                                .map(e => e.season_number)
                                .filter((season): season is number => season !== null && season !== undefined)
                                .sort((a, b) => a - b)

        
        setSeasons(seasonArray)

    }, [allMedia, series])


    const getContainerPosition = (e: React.MouseEvent) => {

        const screenHeight = window.innerHeight;

        const containerPosition = e.currentTarget.closest('.series-edit-details-container')?.getBoundingClientRect();

        const scrollContainerTop = e.currentTarget.closest('.series-edit-details-container')?.scrollTop || 0;

        const top = scrollContainerTop - (containerPosition?.top || 0) + (screenHeight > 600 ? 350 : 200);

        return top;
    };


    const handleEpisodeEditContainer = (episode: MovieDownloadNew, e: React.MouseEvent) => {

        e.stopPropagation();

        const top = getContainerPosition(e);

        setEpisodeEdit({
            media: episode,
            position: {
                top: top,
                left: 100
            }
        })
    };


    const editSeriesDetails = () => {

        showSeriesEditContainer(current => !current);
        
    };


    const closeContainer = (e: React.MouseEvent) => {

        e.stopPropagation()

        showSeriesEditContainer(false)

    };


    //TODO: make function to update series details/images
    const handleSeriesChanges = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(e: React.ChangeEvent<T>) => {

        const { id, value } = e.target;

        setAllSeries(prev => [...prev, series])

        console.log(id, value)
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


            <select
            defaultValue=""
            onChange={(e) => {setSelectedSeason(Number(e.target.value))}}
            >

                <option value="" disabled>Select Season</option>

                {seasons.map(season => {

                    return (

                        <option key={season} value={season}>{season}</option>
                    )
                })}

            </select>


            <div className="series-edit-container-episode-list">

                {allMedia.filter(x => x.series_id === series.id && x.season_number === selectedSeason)
                .map((episode: MovieDownloadNew, index: number) => {

                    return (

                        <div  key={index} className="d-flex flex-column justify-content-center align-items-center gap-1 w-100">

                            <div className="series-record-container border-shadow p-2 mb-2" 
                            onClick={(e) => handleEpisodeEditContainer(episode, e)}>

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


            {seriesEditContainer && 
            
                <div className="edit-series-properties">

                    <div className="series-edit-form">

                        <input id="series-title"
                        defaultValue={series.title}
                        onChange={handleSeriesChanges}
                        />

                        <select id="series-genre"
                        defaultValue={series?.genre || ""}
                        onChange={handleSeriesChanges}
                        >
                            <option value="" disabled>please select</option>
                            <option value="action">Action</option>
                            <option value="comedy">Comedy</option>
                            <option value="fantasy">Fantasy</option>
                            <option value="horror">Horror</option>
                            <option value="sci-fi">Sci-Fi</option>
                            <option value="thriller">Thriller</option>

                        </select>

                        <input id="series-year"
                        type="number"
                        defaultValue={series?.year || ""}
                        onChange={handleSeriesChanges}
                        />

                        <textarea id="series-description"
                        defaultValue={series?.description || ""}
                        onChange={handleSeriesChanges}
                        />

                    </div>


                    {/* TODO: create the images here */}


                    <div className="series-edit-details-button-container">

                        <button
                        onClick={closeContainer}
                        >
                            close
                        </button>

                        <button>update</button>

                        <button>delete</button>

                    </div>

                </div>

            }

        </div>
    )

}

export default SeriesEditDetails