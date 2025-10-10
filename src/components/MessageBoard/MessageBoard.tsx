import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import './MessageBoard.css'
import { url } from '../../Url';

//TODO: url change 
//const url = 'http://localhost:3001';
//const url = 'https://movie-streamer-backend.onrender.com'


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

            if(!user?.token){

                return;
            }

            

            const allMessages = await fetch(`${url}/messages`, {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                }
            });

            const res = await allMessages.json() as {
                payload: MessageUpload[];
                status: string;
            };


            if(res.status === "error"){

                alert("messages failed to load");

                return;
            };


            setAllMessages(res.payload);

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

        let res;

        const timestamp = new Date().toLocaleString();

        if(user){

            res = await fetch(`${url}/messages/send_message`, {

                method: 'POST',

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
           
                body: JSON.stringify({
                    message, 
                    userid: user.id, 
                    username: user.username, 
                    timestamp
                })
            });

            if(res.ok){

                const result = await res.json() as {
                    payload: MessageUpload;
                    status: string;
                };

                console.log(result)
    
                setAllMessages(prev => [...prev, result.payload])
            }


        };
    };



    return (

        <div className="d-flex flex-column h-100 pt-3 pb-3 gap-3 input-field">

                <div className="messages-sent">
                   
                    {allMessages.map((message:MessageUpload, index:number) => {

                        return (
                            <div className="lh-1 message-boxes textarea-style mb-2 p-1" key={index}>
                                <p><b>{message.username.split(' ')[0] + ' ' + message.username.split(' ')[1][0]}</b> <i>{message.timestamp}</i></p>
                                <p>{message.message}</p>
                                
                            </div>
                        )
                    })}
 
                </div>

                <textarea className="send-message input-field textarea-style border-shadow" value={message} placeholder="type your message here.." onChange={(e) => {setMessage(e.target.value)}} onKeyDown={handleEnterPress}></textarea>

        </div>
    )
};

export default MessageBoard;

// className="messages-sent input-field textarea-style border-shadow p-1"