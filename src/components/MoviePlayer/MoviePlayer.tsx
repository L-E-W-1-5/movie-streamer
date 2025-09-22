import { useCallback, useEffect, useState } from 'react';
import './MoviePlayer.css';

type MovieDownload = {
    title: string,
    url: string,
    genre: string
    
}

interface MovieInfo {
    film:MovieDownload
    setMovieUrl: React.Dispatch<React.SetStateAction<MovieDownload>>
}



const MoviePlayer: React.FC<MovieInfo> = ({film, setMovieUrl}) => {

   const [position, setPosition] = useState({x: 0, y: 0});
   const [isDragging, setIsDragging] = useState(false);
   const [offset, setOffset] = useState({x: 0, y: 0});


    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
        setOffset({x: clientX - position.x, y: clientY - position.y})
    };


    const handleMouseUp = () => {

        setIsDragging(false);
    }


    const handleMouseMove = useCallback ((e: MouseEvent | TouchEvent) => {

        if(isDragging){

            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

            setPosition({x: clientX - offset.x, y: clientY - offset.y})
        };

    }, [isDragging, offset])


    useEffect(() => {

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
        window.addEventListener('touchmove', handleMouseMove)
        window.addEventListener('touchend', handleMouseUp)

        return() => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('touchmove', handleMouseMove)
            window.removeEventListener('touchend', handleMouseUp)
        }

    }, [handleMouseMove])


    return(

        <div id="video-drag" className="movie-player-container border-shadow"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            style={{
                left: position.x,
                top: position.y
            }}
            >
            

            <div className="player-navbar d-flex flex-row justify-content-between p-2">

                <p>{film.title}</p>

                <button className="player-close-button border-shadow variable-colour" onClick={() => setMovieUrl({title: "", url: "", genre: ""})}>close</button>
            
            </div>

            <video src={film.url} 
                controls 
                
                
                onLoadedData={() => {
                                console.log('Video loaded');
                                }}
            />
                
        </div>
    )
}

export default MoviePlayer;


 {/* <source src={props.url} type="video/mp4"/>
                <source src={props.url} type="video/webm"/>
                <source src={props.url} type="video/ogg"/> */}