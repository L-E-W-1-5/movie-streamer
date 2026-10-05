import './DashNavBar.css';
import { type MediaType } from '../../Types/Types';
import { useEffect, useState } from 'react';



type UserOptionsProps = {

    showAdminForm: React.Dispatch<React.SetStateAction<boolean>>
    animation: () => void
    setFilteredMedia: React.Dispatch<React.SetStateAction<MediaType[]>>
    filteredMedia: MediaType[]
    allMovies: MediaType[]
    allSeries: MediaType[]
}


const DashNavbar: React.FC<UserOptionsProps> = ({ showAdminForm, animation, setFilteredMedia, allMovies, allSeries }) => {

    const [allMedia, setAllMedia] = useState<MediaType[]>([]);

    const [movieButton, setMovieButton] = useState<boolean>(false);

    const [seriesButton, setSeriesButton] = useState<boolean>(false);
 

    useEffect(() => {

        setAllMedia([
            ...allMovies,
            ...allSeries
        ])

        setFilteredMedia([
             ...allMovies,
             ...allSeries
        ])

    }, [allMovies, allSeries, setFilteredMedia])



    const preventClosureOfMenu = (e: React.MouseEvent) => {

        e.stopPropagation();

        showAdminForm(current => !current);

        animation();
    };

    const searchMedia = (e: React.ChangeEvent<HTMLInputElement>) => {

        console.log(e.target.value);

        const searchCriteria = e.target.value.toLowerCase();
        
        const filtered = allMedia.filter(media => media.title.toLowerCase().includes(searchCriteria));

        console.log("filtered", filtered)

        setFilteredMedia(filtered);
    }

    const toggleMovies = () => {
//TODO: complete navbar tools

        if(movieButton){

            setFilteredMedia(allMedia);

            setMovieButton(false);

            return;
        };

        const filteredMedia = allMedia.filter(media => "media_format" in media &&media.media_format === "movie");

        setFilteredMedia(filteredMedia);

        setMovieButton(true);

        setSeriesButton(false);
    };

    const toggleSeries = () => {
 
        if(seriesButton){

            setFilteredMedia(allMedia);

            setSeriesButton(false);

            return;
        };

        const filteredMedia = allMedia.filter(media => !("media_format" in media));
        
        setFilteredMedia(filteredMedia);

        setMovieButton(false);

        setSeriesButton(true);
    };


    return(

        <nav className="dashboard-nav p-2 d-flex flex-row user-select-none justify-content-between align-items-center">

            <h2 className="pt-1">LuluFlix</h2>   

            <div className="dash-nav-tools">

                <div className="dash-nav-toggle-buttons">
                
                    <span
                    className={"dash-nav-toggle-button" + (movieButton ? " toggle-button-selected" : "")}
                    onClick={toggleMovies}
                    >
                        Movies
                    </span>

                    <span
                    className={"dash-nav-toggle-button" + (seriesButton ? " toggle-button-selected" : "")}
                    onClick={toggleSeries}
                    >
                        Series
                    </span>

                </div>

                <input
                className="dash-searchbar"
                type="text"
                onChange={searchMedia}
                placeholder="search.."
                />

            </div>

            <button className="admin-nav-button" onClick={preventClosureOfMenu}></button>

        </nav>
    )
}

export default DashNavbar