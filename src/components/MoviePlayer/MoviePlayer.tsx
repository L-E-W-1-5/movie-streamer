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

   const playerSize = useRef<HTMLDivElement | null>(null);

   const [isResizing, setIsResizing] = useState(false);

   const [resizeWindow, setWindowSize] = useState<{
        height: number
        width: number
    }>({
        height: 300,
        width: 400
    })



     const handleResizeStart = (e: React.MouseEvent  | React.TouchEvent) => {

        e.stopPropagation();

        setIsResizing(true);
    };


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
        setIsResizing(false);
    };


    const handleMouseMove = useCallback ((e: MouseEvent | TouchEvent) => {

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        if(isDragging){

            // const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

            // const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

            const maxX = window.innerWidth - resizeWindow.width;

            const maxY = window.innerHeight - resizeWindow.height;

            setPosition({
                x: Math.max(0, Math.min(clientX - offset.x, maxX)),
                y: Math.max(0, Math.min(clientY - offset.y, maxY))
            });

            //setPosition({x: clientX - offset.x, y: clientY - offset.y})
        };

        if (isResizing && videoRef.current) {

            const rect = videoRef.current.getBoundingClientRect();

            // const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

            // const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

            const newWidth = clientX - rect.left;

            const newHeight = clientY - rect.top;

            setWindowSize({
                width: Math.max(newWidth, 300),
                height: Math.max(newHeight, 200)
            });
        }

    }, [isDragging, offset, isResizing, resizeWindow])


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

        //console.log(signedUrl.url)

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

        console.log(typeof(signedUrl.url));

        console.log(signedUrl.type);

        if(!signedUrl.type.includes('.mpegurl')){

            console.log("content type", signedUrl.type)

            video.src = signedUrl.url;

            return;
        }


        if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native support

        console.log("canPlay - native support")

            video.src = signedUrl.url;
        }

        let playlistUrl: string

        if (Hls.isSupported()){

            console.log("HLS.isSupported")

            const hls = new Hls();

            hlsRef.current = hls;

            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {

                video.play()
            });

            //this is the woorking line
            //hls.loadSource(URL.createObjectURL(new Blob([signedUrl.url], {type: 'application/x-mpegURL'})))

            const blobUrl = URL.createObjectURL(
                new Blob([signedUrl.url], {
                    type: 'application/x-mpegURL'
                })
            );

            playlistUrl = blobUrl;

            hls.loadSource(blobUrl);


        }else{

            video.src = signedUrl.url;
        }

        video.addEventListener('canplay', handleCanPlay);

        return () => {

            URL.revokeObjectURL(playlistUrl);

            if(hlsRef.current){
            
                hlsRef.current.destroy();
      
                hlsRef.current = null;
            }

            video.removeEventListener('canplay', handleCanPlay);
        };



    }, [signedUrl])


   


  


    return(

        <div id="video-drag" className="movie-player-container border-shadow"
            ref={playerSize}
            
            style={{
                left: position.x,
                top: position.y,
                // height: resizeWindow.height, 
                // width: resizeWindow.width
            }}
            >
            

            <div className="player-navbar d-flex flex-row justify-content-between p-2"
                
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                
                <p className="player-header">{signedUrl.title}</p>

                <button className="player-close-button border-shadow variable-colour" onClick={() => setSignedUrl({title: "", url: "", type: ""})}>close</button>
            
            </div>

            <video 
                ref={videoRef}

                controls 
                preload='metadata'
                
                onLoadedData={() => {
                                console.log('Video loaded');
                                }}
                style={{

                    height: resizeWindow.height,
                    width: resizeWindow.width
                }}
            />
                
            <span className="resize-player"
                onMouseDown={handleResizeStart}      
                onTouchStart={handleResizeStart}  
            >
               
            </span>

        </div>
    )
}

export default MoviePlayer;


 {/* <source src={props.url} type="video/mp4"/>
                <source src={props.url} type="video/webm"/>
                <source src={props.url} type="video/ogg"/> */}


                  // const resizePlayer = (e: React.MouseEvent<HTMLSpanElement>) => {

    //    // const size = playerSize.current?.clientTop;

    //     //const sizeY = playerSize.current?.clientTop

    //     //const sizeX = playerSize.current?.clientWidth;

    //     const sizeY = playerSize.current?.closest('#video-drag')?.clientWidth

    //     const sizeX = playerSize.current?.closest('#video-drag')?.clientHeight
        

    //     if(!sizeY || !sizeX) return;

    //     const playerPosition = playerSize.current?.getBoundingClientRect();

    //     const playerPositionX = playerPosition?.x

    //     const playerPositionY = playerPosition?.y

    //     const mousePositionX = e.clientX;

    //     const mousePositionY = e.clientY;

    //     console.log("sizeX", playerPositionX, "sizeY", playerPositionY, "mouseX", mousePositionX, "mouseY", mousePositionY);



    //     setWindowSize({
    //         height: sizeX,
    //         width: sizeY
    //     })
    // }

    // const setPlayer = (e: React.MouseEvent<HTMLSpanElement>) => {

    //    // const size = playerSize.current?.clientTop;

    //     //const sizeY = playerSize.current?.clientTop

    //     //const sizeX = playerSize.current?.clientWidth;

    //     const sizeY = playerSize.current?.closest('#video-drag')?.clientWidth

    //     const sizeX = playerSize.current?.closest('#video-drag')?.clientHeight
    //     console.log(sizeX, sizeY)

    //     const playerPosition = playerSize.current?.getBoundingClientRect();

    //     const playerPositionX = playerPosition?.x

    //     const playerPositionY = playerPosition?.y

    //     const mousePositionX = e.clientX;

    //     const mousePositionY = e.clientY;

    //     if(!playerPositionX || !mousePositionX || !playerPositionY || !mousePositionY) return;

    //     setWindowSize({
    //         height: playerPositionX - mousePositionX,
    //         width: playerPositionY - mousePositionY
    //     })
    // }