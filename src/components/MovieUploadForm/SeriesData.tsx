import { useState } from 'react';
import SeriesCreationForm from '../SeriesCreationForm/SeriesCreationForm';
import type { MovieUpload, Series } from '../../Types/Types';


type SeriesDataProps = {
    handleChanges: <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        e: React.ChangeEvent<T>
    ) => void;
    series: Series[]
    movieUpload: MovieUpload
    setSeriesContainer: React.Dispatch<React.SetStateAction<boolean>>
    setAllSeries: React.Dispatch<React.SetStateAction<Series[]>>
}
 

export const SeriesData = ({ handleChanges, series, movieUpload, setSeriesContainer, setAllSeries }: SeriesDataProps) => {

    const [addSeriesContainer, showAddSeriesContainer] = useState<string | null>(null)

    return(

        <div className="series-data-container border-shadow p-2 gap-1">

                        <select
                        id="seriesId" 
                        className="series-upload-form-element first-column form-select select-element variable-colour border-shadow" 
                        onChange={handleChanges}
                        defaultValue=""
                        required>

                            <option value="" disabled>
                                select a series..
                            </option>

                            {series.map((series) => (

                                <option key={series.id} value={series.id}>

                                    {series.title}

                                </option>
                            ))}

                        </select>

                        <button 
                            className="upload-form-button button-style border-shadow"
                            onClick={() => showAddSeriesContainer("true")}>
                                add series
                        </button>

                        {addSeriesContainer && 

                            <SeriesCreationForm setOpenForm={showAddSeriesContainer} setAllSeries={setAllSeries}/>
                        }

                        <input
                            id="episodeTitle" 
                            type="text"
                            defaultValue={movieUpload.episode_title || ''}
                            className="series-upload-form-element first-column btn variable-colour border-shadow input-field" 
                            placeholder="episode title"
                            onChange={handleChanges}
                        />

                        <input
                            id="seasonNumber" 
                            type="number"
                            defaultValue={movieUpload.season_number || ''}
                            className="series-upload-form-element first-column btn variable-colour border-shadow input-field" 
                            placeholder="season number"
                            onChange={handleChanges}
                        />

                        <input
                            id="episodeNumber" 
                            type="number"
                            defaultValue={movieUpload.episode_number || ''}
                            className="series-upload-form-element first-column btn variable-colour border-shadow input-field" 
                            placeholder="episode number"
                            onChange={handleChanges}
                        />

                        <button 
                            className="upload-form-button button-style border-shadow mt-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSeriesContainer(true);
                            }}
                            >
                                Done
                        </button>
                    
                    </div>
    )
}