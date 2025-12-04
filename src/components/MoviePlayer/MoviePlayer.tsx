import { useCallback, useEffect, useState, useRef } from 'react';
import './MoviePlayer.css';
import { type MovieUrl } from '../../Types/Types';
import Hls from 'hls.js'


interface MovieInfo {
    signedUrl: MovieUrl,
    setSignedUrl: React.Dispatch<React.SetStateAction<MovieUrl>>
}



const MoviePlayer: React.FC<MovieInfo> = ({setSignedUrl, signedUrl}) => {

   const [position, setPosition] = useState({x: 0, y: 0});

   const [offset, setOffset] = useState({x: 0, y: 0});
   
   const [isDragging, setIsDragging] = useState(false);

   const videoRef = useRef<HTMLVideoElement | null>(null);

   const hlsRef = useRef<Hls | null>(null);


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
    };


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


    useEffect(() => {

        const video = videoRef.current;

        if(!video) return

        if (hlsRef.current){

            hlsRef.current.destroy();

            hlsRef.current = null;
        }

        if(!signedUrl.url) return;

        const handleCanPlay = () => {

            video.play()
            
            .catch(e => console.error("Playback Prevented", e));
        };

        // video.removeEventListener('canplay', handleCanPlay);

        if(!signedUrl.url.endsWith('.m3u8')){

            video.src = signedUrl.url;

            return;
        }


        if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native support

            video.src = signedUrl.url;
        }

        if (Hls.isSupported()){

            const hls = new Hls();

            hlsRef.current = hls;

            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {

                
            });

            hls.loadSource(signedUrl.url);


        }else{

            video.src = signedUrl.url;
        }

        video.addEventListener('canplay', handleCanPlay);

        return () => {

            if(hlsRef.current){
            
                hlsRef.current.destroy();
      
                hlsRef.current = null;
            }

            video.removeEventListener('canplay', handleCanPlay);
        };

    }, [signedUrl])


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

                <p className="player-header">{signedUrl.title}</p>

                <button className="player-close-button border-shadow variable-colour" onClick={() => setSignedUrl({title: "", url: ""})}>close</button>
            
            </div>

            <video 
                ref={videoRef}

                controls 
                preload='metadata'
                
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