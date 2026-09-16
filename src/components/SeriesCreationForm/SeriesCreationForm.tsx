import "./SeriesCreationForm.css";
import { useState } from "react";
import { type SeriesUpload } from "../../Types/Types";


type SeriesCreationProps = {
    setOpenForm: React.Dispatch<React.SetStateAction<string | null>>
};


export const SeriesCreationForm: React.FC<SeriesCreationProps> = ({ setOpenForm }) => {

    const [seriesDetails, setSeriesDetails] = useState<SeriesUpload | null>(null);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
    
        const formData = new FormData(e.currentTarget);

        console.log("formData", formData);

        setSeriesDetails({
            title: formData.get("series-title") as string,
            genre: formData.get("series-genre") as string,
            description: formData.get("series-description") as string | null,
            images: formData.getAll("series-images") as File[],
        })

        console.log("seriesDetails", seriesDetails);

        //TODO: create the fetch request after creating the route for series' upload
    };

    const stopMenuClosure = (e: React.MouseEvent) => {

        e.stopPropagation()

        setOpenForm(null)
    };


    return (

        <div>

            <form onSubmit={handleSubmit} className="upload-form border-shadow container-style p-3 gap-2">

                <input 
                    className="upload-form-element first-column btn variable-colour border-shadow"
                    id="series-images" 
                    name="series-images"
                    type="file" 
                    multiple
                    {...({ webkitdirectory: true } as React.InputHTMLAttributes<HTMLInputElement>)}
                />
 
                <input 
                    className="upload-form-element first-column btn variable-colour border-shadow input-field" 
                    id="series-title" 
                    name="series-title" 
                    type="text" 
                    placeholder="Series Title"
                />

                <select id="series-genre" name="series-genre"
                    className="upload-form-element first-column form-select select-element variable-colour border-shadow" >       
                    <option value="">please select</option>
                    <option value="action">Action</option>
                    <option value="comedy">Comedy</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="horror">Horror</option>
                    <option value="sci-fi">Sci-Fi</option>
                    <option value="thriller">Thriller</option>
                </select>

                <textarea 
                    id="series-description" 
                    className="upload-form-element upload-form-textarea second-column variable-colour border-shadow input-field" 
                    name="series-description" 
                    placeholder="Series Description"
                />


                <div className=" upload-form-buttons d-flex align-self-center mt-3">
                
                    <button 
                        className="upload-form-button button-style border-shadow" 
                        type="button"
                        onClick={stopMenuClosure}>
                        close
                    </button>

                    <button 
                        className="upload-form-button button-style border-shadow" 
                        type="submit">
                        upload
                    </button>

                    

                </div>

            </form>
        </div>

    )

};

export default SeriesCreationForm;