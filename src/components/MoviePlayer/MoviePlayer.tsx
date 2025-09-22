import './MoviePlayer.css';

type MovieData = {
    title: string,
    url: string,
    setMovieUrl: React.Dispatch<React.SetStateAction<string>>
}

const MoviePlayer = (props:MovieData) => {

    return(
        <div>

            <p>{props.title}</p>
            
            <video src={props.url} 
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