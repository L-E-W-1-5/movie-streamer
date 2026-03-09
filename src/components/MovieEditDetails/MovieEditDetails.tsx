import { useContext,  useState } from 'react'
import { UserContext } from '../../UserContext';
import { type MovieDownloadNew, type MovieImage, type ImageUpload } from '../../Types/Types';
import { url } from '../../Url';
import './MovieEditDetails.css'




type MovieDetailsProps = {
    movie: MovieDownloadNew
    setAllMovies: React.Dispatch<React.SetStateAction<MovieDownloadNew[]>>
    setMovieEditContainer: React.Dispatch<React.SetStateAction<{
        movie: MovieDownloadNew,
        position: {
            top: number,
            left: number
        }
    } | null>>
}



const MovieEditDetails: React.FC<MovieDetailsProps> = ({movie, setAllMovies, setMovieEditContainer}) => {

    const { user } = useContext(UserContext);

    const [ edit, setEdit ] = useState<MovieDownloadNew>(movie)

    const [editForm, setEditForm] = useState<boolean>(false)



    const handleDelete = async () => {
    
        const confirmed = window.confirm("are you sure you wish to delete this movie?");
    
        if(!confirmed) return;
    
        if(!user?.token) return;
    
        try{
    
            const res = await fetch(`${url}/movies/delete_movie`, {
    
                method: 'POST',
    
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
    
                body: JSON.stringify({movie})
    
            });
    
            const response = await res.json();
    
            if(res.ok && response.status === "success"){
    
                console.log(response)

                setAllMovies(prevMovies => prevMovies.filter(m => m.id !== movie.id))
            };
    
    
        }catch(err){
    
            console.log(err);
        };
    };


    const handleDeleteImage = async (image: MovieImage) => {

        console.log(image);

        const confirmed = confirm("are you sure you want to delete this image?");

        if(!confirmed) return;

        if(!user?.token) return;

        try{

            const res = await fetch(`${url}/movies/image_delete`, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${user.token}`
                },

                body: JSON.stringify({image})
            });

            if(!res.status.toString().startsWith('2')){

                alert("Network issue: Unable to delete image");
            };
                
            const response = await res.json();

            if(response.status === "success"){

                setAllMovies(allMovies => {

                    return allMovies.map(mov => 

                        mov.id === movie.id ? {

                            ...mov, 
                        
                            images: mov.images?.filter(img => img.id !== response.payload.id)
                        
                        } : mov
                    );
                })

                alert("Image deleted");
            };


        }catch(err){

            console.error(err);
        };
    };


    const handleuploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {

        if(e.target.files){

            const filesArray = Array.from(e.target.files);

            const newImageEntries: ImageUpload[] = []

            let cardSet = false, containerSet = false;

            movie.images?.forEach(image => {

                if(image.usage === 'card') cardSet = true;

                if(image.usage === 'container') containerSet = true;
            });

            console.log("filesArrayBefore", filesArray)


            filesArray.forEach((file, index) => {

                console.log(file, index, cardSet, containerSet)

                if(!cardSet && movie.images){

                    console.log("card entered", file)

                    newImageEntries.push({file: file, usage: 'card', name: file.name})

                    cardSet = true;

                    return;
                }
                if(!containerSet && movie.images){

                    console.log("container entered", file)

                    newImageEntries.push({file: file, usage: 'container', name: file.name})

                    containerSet = true;

                    return;
                }

                console.log("other", file)

                newImageEntries.push({file: file, usage: "other", name: file.name})
            })

            setEdit(prev => ({...prev, image: newImageEntries}))
        }
    };


    const changeImagePosition = (e: React.MouseEvent, index: number, image: MovieImage) => {

        e.stopPropagation();

        if(!edit.images || edit.images.length < 2) return


        const arraySwap = async (a: number, b: number) => {

            if(!edit.images) return

            const newPosition = edit.images.map(img => ({...img})); 

            let aSwap: MovieImage | null = null, bSwap: MovieImage | null = null;


            for(let i = 0; i < newPosition.length; i++){

                if(newPosition[i].id === a) aSwap = newPosition[i];

                if(newPosition[i].id === b) bSwap = newPosition[i];
            };

            if(aSwap && bSwap){

                [aSwap.usage, bSwap.usage] = [bSwap.usage, aSwap.usage];
            };


            setEdit(prev => ({...prev, images: newPosition}));

            setAllMovies(allMovies => {

                return allMovies.map(mov => 

                    mov.id === movie.id ? {

                        ...mov,

                        images: newPosition 

                    } : mov
                ) 
            })

            const formData = new FormData();

            if(aSwap && bSwap){

                formData.append('imagesUp', String(aSwap.id));//newPosition[a].id));

                formData.append('imagesUp', String(bSwap.id));//newPosition[b].id));

                formData.append(String(aSwap.id), aSwap.usage);

                formData.append(String(bSwap.id), bSwap.usage);

            }

            try{

                const res = await fetch(`${url}/movies/update_image`, {

                    method: 'POST',

                    headers: {

                        'authorization': `Bearer ${user?.token}`
                    },

                    body: formData
                });

                const response = await res.json();

                if(res.ok && response.status === "success"){

                    console.log(response.payload);
                };
        
            }catch(err){

                console.log(err)
            }

        };


        const getIds = () => {

            let containerId: number = -1, cardId: number = -1;

            if(!movie.images) return;

            const imageArray = [...movie.images];

            imageArray.forEach((image, index) => {

                if(image.usage === 'container'){

                    containerId = image.id;
                    console.log("container id", index, image.id, image.original_name, image.usage)

                    return;
                }

                if(image.usage === 'card'){

                    cardId = image.id;
                    console.log("card id", index, image.id, image.original_name, image.usage)

                    return;
                }
            });

            if(containerId !== -1 && cardId !== -1){

                return {
                    "containerId": containerId,
                    "cardId": cardId
                };
            };
        };


        if(index === 0){

            const confirmed = confirm("Make this image the 'open container' image?");

            const ids = getIds();

            if(!ids || !confirmed) return;

            if(ids.containerId !== -1 && ids.cardId !== -1){

                console.log(ids.cardId, ids.containerId);

                arraySwap(ids.cardId, ids.containerId);
            };
        }
        else if(index === 1){

            const confirmed = confirm("Make this image the 'movie card' image?");

            const ids = getIds();

            if(!ids || !confirmed) return

            if(ids.containerId !== -1 && ids.cardId !== -1){

                console.log("337", ids.cardId, ids.containerId)

                arraySwap(ids.cardId, ids.containerId)
            }
        }
        else{

            const position = prompt("which position would you like this image, type 1 for the card or 2 for the 'open container' image.");

            const numPosition = Number(position)

            if(numPosition === 1 || numPosition === 2){

                const ids = getIds();

                if(!ids) return;

                if(numPosition === 1 && ids.cardId !== -1){

                    arraySwap(image.id, ids.cardId);

                    return;
                }

                if(numPosition === 2 && ids.containerId !== -1){

                    arraySwap(image.id, ids.containerId);

                    return;
                }
  
            } else {

                alert("invalid input, please type 1 to use the image for the card or 2 to use it for the 'open container'.");
            }
        }

    }




    function changeNewEdit<T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> (e: React.ChangeEvent<T>){

        e.stopPropagation();

        const { id, value } = e.target;

        if(!id || !value) return;

        switch(id){

            case "title":
            setEdit(prev => ({...prev, title: value}))
            break;
           
            case "description":
            setEdit(prev => ({...prev, description: value}))
            break;

            case "genre":
            setEdit(prev => ({...prev, genre: value}))
            break;

            case "year":
            setEdit(prev => ({...prev, year: parseInt(value)}))
            break;

            case "length":
            setEdit(prev => ({...prev, length: value}))
            break;
        };
    };


    const makeFormData = () => {

        const formData = new FormData();

        formData.append('id', edit.id.toString())

        formData.append('title', edit.title);

        if(edit.genre) formData.append('genre', edit.genre);

        if(edit.description) formData.append('description', edit.description);

        if(edit.year) formData.append('year', edit.year.toString());

        if(edit.length) formData.append('length', edit.length);

        if(edit.image && edit.image.length > 0){

            edit.image.forEach((i) => {

                formData.append('image[]', i.file, i.name)

                if(i.usage){

                    formData.append(i.name, i.usage);
                }

            }) 
        } 

        return formData
    };


    const updateMovieDetails = async () => {

        const form = makeFormData();

        try{

            const res = await fetch(`${url}/movies/update_movie`, {

                method: 'POST',

                headers: {
                    "authorization": `Bearer ${user?.token}`
                },

                body: form
            });

            const response = await res.json();

            if(res.ok && response.status === "success"){

                
                setAllMovies(prevMovies => {

                    return prevMovies.map(movie => {

                        const newImages = (response.payload.images && response.payload.images.length > 0) ? response.payload.images : [];

                        const updatedImages = movie.images ? [...movie.images, ...newImages].filter(Boolean) : newImages ? [...newImages] : []

                        return movie.id === edit.id ? {
                            ...movie, 
                            ...edit,
                            images: updatedImages   
                        } : movie
                    });
                });

                alert("movie updated successfully");
            };

        }catch(err){

            console.log(err);
        };
    };


    
    const handleEditOptions = async (e: React.MouseEvent<HTMLButtonElement>) => {

        e.stopPropagation();

        setEditForm(true);

        setEdit(movie);
    };


    const closeForm = (e: React.MouseEvent<HTMLButtonElement>) => {

        e.stopPropagation();

        setMovieEditContainer(null);
    };


    const closeEdit = (e: React.MouseEvent<HTMLButtonElement>) => {

        e.stopPropagation();

        setEditForm(false);
    };




    return(

        <div className="movie-record d-flex flex-column justify-content-around align-items-center w-100 border-shadow container-style">
            
            {!editForm &&

            <div className="d-flex flex-column justify-content-around align-items-center w-100">
                
                <h4 className="mt-4">{movie.title}</h4>
                <span>{movie.genre}</span>
                <span>{movie.description}</span>
                <span>{`year of movie: ${movie.year}`}</span>
                <span>{`date of upload: ${movie.timestamp}`}</span>
                <span>{`number of times played: ${movie.times_played}`}</span>
                <span>{movie.length ? `length of movie: ${movie.length}` : ""}</span>
                <span>{movie.key}</span>

                <div className="d-flex flex-row gap-5 mb-4 mt-4">

                    <button className="button-style border-shadow" onClick={handleDelete}>delete</button>

                    <button className="button-style border-shadow" onClick={handleEditOptions}>edit</button>

                    <button className="button-style border-shadow" onClick={closeForm}>close</button>
            
                </div>

            </div>
            }




            {editForm && 
            
                <div className="w-100" >

                    <div className="form-grid p-4">

                        <div className="first-column d-flex flex-column justify-content-around">

                            <label>title: 
                                <input id="title" className="movie-edit-details-element btn variable-colour border-shadow" defaultValue={movie.title} onChange={changeNewEdit}/>
                            </label>

                            <label>genre: 
                                <select id="genre" className="movie-edit-details-element first-column form-select select-element variable-colour border-shadow" defaultValue={movie.genre ? movie.genre : ""} onChange={changeNewEdit}>
                                    <option value="">please select</option>
                                    <option value="action">Action</option>
                                    <option value="comedy">Comedy</option>
                                    <option value="fantasy">Fantasy</option>
                                    <option value="horror">Horror</option>
                                    <option value="sci-fi">Sci-Fi</option>
                                    <option value="thriller">Thriller</option>
                                </select>
                            </label>

                            <label>year: 
                                <input id="year" className="movie-edit-details-element btn variable-colour border-shadow" type="number" defaultValue={movie.year ? movie.year : ""} onChange={changeNewEdit}/>
                            </label>

                            <label>length
                                <input id="length" className="movie-edit-details-element btn variable-colour border-shadow" type="text" defaultValue={movie.length ? movie.length : ""} onChange={changeNewEdit}/>
                            </label>

                        </div>
                   
                        <div className="second-column h-100">

                            <label>description: 
                                <textarea id="description" className="edit-details-textarea variable-colour border-shadow input-field" defaultValue={movie.description ? movie.description : ""} onChange={changeNewEdit}/>
                            </label>

                        </div>

                        <div className="image-edit two-column-container">

                            <div className="d-flex flex-column">

                                <h6><b>images</b></h6>

                                <div className='d-flex flex-row gap-5 overflow-x-scroll'>               

                                          {movie.images && 
                                          
                                          [...movie.images]

                                          .sort((a, b) => {

                                            const order: {[key: string]: number} = { 'card': 1, 'container': 2 };

                                            const aOrder = order[a.usage] || 3;

                                            const bOrder = order[b.usage] || 3;

                                            return aOrder - bOrder
                                          })

                                          .map((image: MovieImage, x: number) => {

                                                return  <div className="image-viewport" key={x} >
                                                    
                                                           <div onClick={(e) => changeImagePosition(e, x, image)}><p><u>{x + 1 === 1 ? "card image" : x + 1 === 2 ? "open image" : "extra image"}</u></p></div>

                                                            <p> {image.original_name}<button className='delete-cross' onClick={() => handleDeleteImage(image)}></button></p>   

                                                            <img className="image-display" src={image.url}/>

                                                        </div>
                                            })
                                               
                                    }
                         
                                </div>

                            </div>

                            

                        </div>

                        <input 
                                className="movie-edit-details-element button-style border-shadow mt-3" 
                                type="file" 
                                name="movieImages"
                                multiple
                                {...({ webkitdirectory: true } as React.InputHTMLAttributes<HTMLInputElement>)}
                                onChange={handleuploadImage}/>



                        <div className="two-column-container d-flex gap-3">

                            <button className="button-style border-shadow align-self-center" onClick={updateMovieDetails}>update</button>

                            <button className="button-style border-shadow align-self-center" onClick={closeEdit}>close</button>

                        </div>

                    </div>

                </div>
            
            }

        </div>
    )
}

export default MovieEditDetails