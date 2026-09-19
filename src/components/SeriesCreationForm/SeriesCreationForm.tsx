import "./SeriesCreationForm.css";
import { useContext, useState } from "react";
import { type SeriesUpload, type Series } from "../../Types/Types";
import { url } from '../../Url';
import { UserContext } from "../../UserContext";


type SeriesCreationProps = {
    setOpenForm: React.Dispatch<React.SetStateAction<string | null>>
    setAllSeries: React.Dispatch<React.SetStateAction<Series[]>>
};


export const SeriesCreationForm: React.FC<SeriesCreationProps> = ({ setOpenForm, setAllSeries }) => {

    const { user } = useContext(UserContext)

    const [seriesDetails, setSeriesDetails] = useState<SeriesUpload | null>(null);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
    
        const formData = new FormData(e.currentTarget);

        console.log("formData", formData);

        setSeriesDetails({
            title: formData.get("title") as string,
            genre: formData.get("genre") as string,
            description: formData.get("description") as string | null,
            year: formData.get("year") as number | null,
            images: formData.getAll("images[]") as File[],
        })

       console.log("seriesDetails", seriesDetails);

        try{
            const res = await fetch(`${url}/movies/series`, {

                headers: {"Authorization": `Bearer ${user?.token}`},
            
                method: "POST",

                body: formData,
            })

            const reply = await res.json();

            console.log("series reply payload", reply.payload)

            //TODO: test that this is adding to state correctly.
            if(res.ok && reply.status === "success"){

                setAllSeries(prev => [...prev, reply.payload]);

                alert("series added successfully");

                setOpenForm(null);
            }
        
        }catch(err){

            console.log(err)
        };
    };




    const stopMenuClosure = (e: React.MouseEvent) => {

        e.stopPropagation()

        setOpenForm(null)
    };


    return (

        <div>

            <form onSubmit={handleSubmit} className="upload-form border-shadow container-style p-3 gap-2">

                <input 
                    id="series-images" 
                    name="images[]"
                    className="upload-form-element first-column btn variable-colour border-shadow"
                    type="file" 
                    multiple
                    {...({ webkitdirectory: true } as React.InputHTMLAttributes<HTMLInputElement>)}
                />
 
                <input 
                    id="series-title" 
                    name="title" 
                    className="upload-form-element first-column btn variable-colour border-shadow input-field" 
                    type="text" 
                    placeholder="Series Title"
                />

                <select 
                    id="series-genre" 
                    name="genre"
                    className="upload-form-element first-column form-select select-element variable-colour border-shadow" >       
                        <option value="">please select</option>
                        <option value="action">Action</option>
                        <option value="comedy">Comedy</option>
                        <option value="fantasy">Fantasy</option>
                        <option value="horror">Horror</option>
                        <option value="sci-fi">Sci-Fi</option>
                        <option value="thriller">Thriller</option>
                </select>

                <input
                    id="series-year"
                    name="year"
                    className="upload-form-element first-column btn variable-colour border-shadow input-field" 
                    type="number"
                    placeholder="series year"
                />

                <textarea 
                    id="series-description" 
                    name="description" 
                    className="upload-form-element upload-form-textarea second-column variable-colour border-shadow input-field" 
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