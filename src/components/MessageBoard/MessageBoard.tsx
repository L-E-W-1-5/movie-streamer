import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import './MessageBoard.css'

//TODO: url change 
//const url = 'http://localhost:3001';
const url = 'https://movie-streamer-backend.onrender.com'


type MessageUpload = {
    username: string,
    userid: string,
    timestamp: string,
    message: string
}

const MessageBoard = () => {

    const { user } = useContext(UserContext);

    const [allMessages, setAllMessages] = useState<Array<MessageUpload>>([]);

    const [message, setMessage] = useState<string>('');



    useEffect(() => {

        const fetchAllMessages = async () => {

            const allMessages = await fetch(`${url}/messages`, {

                headers: {"Content-Type": "application/json"}
            });

            const res = await allMessages.json() as {
                payload: MessageUpload[];
                status: string;
            };

            console.log(res);

            if(res.status === "success"){

                console.log(res.status, res.payload);

                setAllMessages(res.payload);

                return;
            };

            alert("messages failed to load");
        };

        fetchAllMessages();

    }, [user])



    const handleEnterPress = (e:React.KeyboardEvent<HTMLTextAreaElement>) => {

        if(e.key === 'Enter'){

            e.preventDefault();

            sendMessage(message);

            setMessage("");
        }

        
    };

    const sendMessage = async (message:string) => {

        let result;

        const timestamp = new Date().toLocaleString();

        if(user){

            result = await fetch(`${url}/messages/send_message`, {

                method: 'POST',

                headers: {"Content-Type": "application/json"},
           
                body: JSON.stringify({
                    message, 
                    userid: user.id, 
                    username: user.username, 
                    timestamp
                })
            });

            const res = await result.json() as {
                payload: MessageUpload;
                status: string;
            };

            setAllMessages(prev => [...prev, res.payload])

        };
    };



    return (

        <div className="d-flex flex-column h-100 pt-3 pb-3 gap-3">

                <div className="messages-sent input-field textarea-style border-shadow p-1">
                   
                    {allMessages.map((message:MessageUpload, index:number) => {

                        return <p key={index}>{message.username.split(' ')[0] + ' ' + message.username.split(' ')[1][0]}: {message.message} - {message.timestamp}</p>

                    })}
 
                </div>

                <textarea className="send-message input-field textarea-style border-shadow" value={message} placeholder="type your message here.." onChange={(e) => {setMessage(e.target.value)}} onKeyDown={handleEnterPress}></textarea>

        </div>
    )
};

export default MessageBoard;