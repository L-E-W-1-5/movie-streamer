

type MovieData = {
    title: string,
    url: string
}

const MoviePlayer = (props:MovieData) => {

    return(
        <div>

            <p>{props.title}</p>
            
            <video src={props.url} 
                controls 
                width="640" 
                height="360"  
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