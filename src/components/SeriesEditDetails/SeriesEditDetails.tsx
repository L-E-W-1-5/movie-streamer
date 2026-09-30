import { type MovieDownloadNew, type MovieImage, type Series, type ImageUpload } from "../../Types/Types"
import './SeriesEditDetails.css'
import { useState, useEffect, useContext } from 'react'
import MovieEditDetails from "../MovieEditDetails/MovieEditDetails"
import { WindowFocus } from "../WindowFocus/WindowFocus"
import { url } from '../../Url'
import { UserContext } from '../../UserContext'


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

    const [seriesEdit, setSeriesEdit] = useState<Series>(series);

    const { user } = useContext(UserContext);




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


    const openSeriesDetails = () => {

        showSeriesEditContainer(true);
        
    };


    const closeContainer = (e: React.MouseEvent) => {

        e.stopPropagation()

        showSeriesEditContainer(false)

    };


    //TODO: make function to upload new images
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

        if(e.target.files){

            const filesArray = Array.from(e.target.files)

            const newImages: ImageUpload[] = [];

            let cardSet = false, containerSet = false
            
            series.images?.forEach(image => {

                if(image.usage === 'series-card') cardSet = true;

                if(image.usage === 'series-container') containerSet = true;
            })

            filesArray.forEach((file) => {

                if(!cardSet){

                    newImages.push({file: file, usage: 'series-card', name: file.name});

                    cardSet = true;

                    return;
                }

                if(!containerSet){

                    newImages.push({file: file, usage: 'series-container', name: file.name})

                    containerSet = true;

                    return;
                }

                newImages.push({file: file, usage: 'other', name: file.name});
            })

            setSeriesEdit(prev => ({...prev, image: newImages}));
        }

    }
 

    const handleSeriesChanges = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(e: React.ChangeEvent<T>) => {

        const { id, value } = e.target;

        switch(id) {

            case "series-title":
                setSeriesEdit(prev => ({...prev, title: value}))
            break;

            case "series-genre":
                setSeriesEdit(prev => ({...prev, genre: value}))
            break;

            case "series-year":
                setSeriesEdit(prev => ({...prev, year: Number(value)}))
            break;

            case "series-description":
                setSeriesEdit(prev => ({...prev, description: value}))
            break;
        }

       // console.log(seriesEdit)
    };


    const makeFormData = () => {

        const formData = new FormData();

        formData.append('id', seriesEdit.id.toString());

        formData.append('title', seriesEdit.title);

        if(seriesEdit.genre){

            formData.append('genre', seriesEdit.genre);
        };

        if(seriesEdit.description){

            formData.append('description', seriesEdit.description);
        }

        if(seriesEdit.year){

            formData.append('year', seriesEdit.year.toString());
        }

        if(seriesEdit.image){

            seriesEdit.image.forEach(image => {

                formData.append('image[]', image.file, image.name)
                
                if(image.usage){

                    formData.append(image.name, image.usage)
                }
            })
        }

        return formData;
    };


    const handleSubmit = async () => {

        if(!user?.token || user?.username === "demo account"){

            alert("editing not available for demo account");

            return;
        }

        const data = makeFormData()

        console.log(data);

        //try
        const res = await fetch(`${url}/movies/update_series`, {

            headers: {"Authorization": `Bearer ${user?.token}`},

            method: 'POST',

            body: data
        })

        const response = await res.json();
        
        if(res.ok && response.status === "success"){

            console.log(response)

            const newImages = (response.payload.images && response.payload.images.length > 0) 
                ? response.payload.images : [];
            
            setAllSeries(prevSeries => 

                prevSeries.map(series => {

                    if(series.id !== seriesEdit.id) return series;

                    return {
                        ...series,
                        ...seriesEdit,
                        images: [
                            ...(series.images ?? []),
                            ...newImages
                        ].filter(Boolean)
                    };
                })
            )

            alert("series updated successfully")

            setSeriesEditContainer(null)
        };

    }


    const handleDeleteImage = async (image: MovieImage) => {

        if(!user?.token || user?.username === "demo account"){

            alert("editing not available for demo account");

            return;
        };

        const confirmed = confirm("are you sure you want to delete this image?");

        if(!confirmed) return;

        try{

            const res = await fetch(`${url}/movies/image_delete`, {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${user.token}`
                },

                body: JSON.stringify({image})
            })

            const response = await res.json()

            if(res.ok || response.status === "success"){

                setAllSeries(prev => {

                    return prev.map(item => 

                        item.id === series.id ? {

                            ...item,

                            images: item.images?.filter(img => img.id !== response.payload.id)

                        } : item

                    )
                })

                alert("image deleted");

                setSeriesEditContainer(null)
            }
        
        }catch(err){

            console.log(err)
        }

    }

    //TODO: add a delete button and function for the entire series and make the backend route.
    const deleteSeries = async () => {

        const willDelete = confirm("are you sure you wish to delete this series?");

        if (!willDelete) return;

        if(!user?.token || user.username === "demo account"){

            alert("unable to delete media using a demo account");
        };

        try{

            const res = await fetch(`${url}/movies/delete_series`, {

                method: 'POST',

                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer: ${user?.token}`
                },

                body: JSON.stringify({series})
            })

            const { payload, status} = await res.json();

            if(res.ok && status === "success"){

                setAllSeries(series => series.filter(item => item.id !== payload.id))
               // setAllMovies(media => media.filter(x => x.series_id !== payload.id))
                
            };


        }catch(err){

            console.log(err);
        }
    }

    return (

        <div className="series-edit-details-container border-shadow">

            <div className="series-edit-details-info">
                <h4>{series.title}</h4>
                <span>{series.genre}</span>
                <span>{series.description}</span>
                <span>{series.year}</span>
            </div>


            <select
            className="btn variable-colour border-shadow"
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

                                <WindowFocus level={3}>

                                    <MovieEditDetails movie={episode} setAllMovies={setAllMovies} setMovieEditContainer={setEpisodeEdit}/>

                                </WindowFocus>

                            </div>

                        }

                        </div>
                    )

                })}

            </div>


            <div className="series-edit-details-button-container">

                <button className="button-style border-shadow"
                onClick={(e) => {
                    e.stopPropagation()
                    setSeriesEditContainer(null)
                    }}
                >
                    close
                </button>

                <button className="button-style border-shadow"
                onClick={openSeriesDetails}
                >             
                    edit
                </button>

            </div>


            {seriesEditContainer && 
            
                <div className="edit-series-properties">

                    <div className="series-edit-form mt-2">

                        <input id="series-title"
                        className="series-edit-details-element first-column btn variable-colour border-shadow"
                        defaultValue={series.title}
                        onChange={handleSeriesChanges}
                        />

                        <select id="series-genre"
                        className="series-edit-details-element first-column btn variable-colour border-shadow"
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
                        className="series-edit-details-element first-column btn variable-colour border-shadow"
                        type="number"
                        defaultValue={series?.year || ""}
                        onChange={handleSeriesChanges}
                        />

                        <textarea id="series-description"
                        className="series-edit-details-element second-column btn variable-colour border-shadow"
                        defaultValue={series?.description || ""}
                        onChange={handleSeriesChanges}
                        />

                    </div>


                    <div className="d-flex flex-row gap-5">

                        {series.images && series.images.map((image: MovieImage, x: number) => {

                                return (
    
                                    <div className="series-image-viewport" key={x} >

                                        <div>

                                            <p>

                                                <u>{x + 1 === 1 ? "card image" : x + 1 === 2 ? "open image" : "extra image"}</u>
                                            
                                            </p>
                                        
                                        </div>                                                    
                    
                                        <p> {image.original_name}

                                            <button className='delete-cross' onClick={() => handleDeleteImage(image)}></button>
                                                                
                                        </p>   

                                        <img className="series-image-display" src={image.url}/>

                                    </div>
                                )

                            })
                            //  onClick={(e) => changeImagePosition(e, x, image)}
                        
                        }

                    </div>

                    <label className="d-flex flex-column">add image:

                        <input
                        className="variable-colour border-shadow container-style"
                        id="series-images"
                        type="file"
                        multiple
                        {...({ webkitdirectory: true } as React.InputHTMLAttributes<HTMLInputElement>)}
                        onChange={handleImageUpload}
                        />

                    </label>

                    <div className="series-edit-details-button-container">

                        <button
                        className="button-style border-shadow"
                        onClick={closeContainer}
                        >
                            close
                        </button>

                        <button
                        className="button-style border-shadow"
                        onClick={handleSubmit}
                        >
                            update
                        </button>

                        <button
                        className="button-style border-shadow"
                        onClick={deleteSeries}
                        >
                            delete
                        </button>

                    </div>

                </div>

            }

        </div>
    )

}

export default SeriesEditDetails