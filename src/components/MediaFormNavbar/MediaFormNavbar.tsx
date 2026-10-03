import './MediaFormNavbar.css'
import { type MediaType } from '../MovieEditForm/MovieEditForm'



type MediaNavProps = {
    setFilteredList: React.Dispatch<React.SetStateAction<MediaType[]>>
    allMedia: MediaType[]
    filteredList: MediaType[]
}


export const MediaFormNavbar = ({ setFilteredList, allMedia, filteredList }: MediaNavProps) => {


    const handleType = (e: React.ChangeEvent<HTMLSelectElement>) => {

        const type = e.target.value;

        let filtered: MediaType[] = []

        console.log(type)

        switch(type) {

            case "all media":
                filtered = allMedia
            break;

            case "movies":
                filtered = allMedia.filter(x => "media_format" in x && x.media_format === "movie")
            break;

            case "episodes":
                filtered = allMedia.filter(x => "media_format" in x && x.media_format === "series")
            break;

            case "series": 
                filtered = allMedia.filter(x => !("media_format" in x))
            break;
        }

        setFilteredList(filtered)
    };


    const sortMedia = (e: React.ChangeEvent<HTMLSelectElement>) => {

        const value = e.target.value;

        let sorted: MediaType[] = []

        switch(value){

            case "sort by id":

                sorted = [...filteredList].sort((a, b) => {
                    return a.id - b.id
                })
            break;

            case "sort by name":
                
                sorted = [...filteredList].sort((a, b) => {
                    return a.title.localeCompare(b.title)
                })
            break;

            case "sort by type":
                sorted = [...filteredList].sort((a, b) => {

                    const getType = (media: MediaType) => {

                        if(!("media_format" in media)){

                            return "Series"
                        }
                        if(media.media_format === "movie"){

                            return "Movie"
                        }

                        return "Episode"
                    }

                    return getType(a).localeCompare(getType(b));
                })
            break;
        }

        setFilteredList(sorted)
    };


    const searchMedia = (e: React.ChangeEvent<HTMLInputElement>) => {

        const search = e.target.value.toLowerCase();

        console.log(search);

        const searchResult = allMedia.filter(media => media.title.toLowerCase().includes(search));

        console.log(searchResult);

        setFilteredList(searchResult)
    };


    return (

        <div className="media-form-nav">
        
            <select
            className="media-nav-element btn variable-colour border-shadow"
            defaultValue=""
            onChange={handleType}
            >

                <option disabled>select type</option>
                <option>all media</option>
                <option>movies</option>
                <option>series</option>
                <option>episodes</option>

            </select>

            <select
            className="media-nav-element btn variable-colour border-shadow"
            onChange={sortMedia}
            defaultValue=""
            >

                <option disabled>select sort</option>
                <option>sort by id</option>
                <option>sort by name</option>
                <option>sort by type</option>

            </select>

            <input
            className="media-nav-element btn variable-colour border-shadow"
            onChange={searchMedia}
            type="text"
            placeholder="search.."
            />
        
        </div>
    )
}