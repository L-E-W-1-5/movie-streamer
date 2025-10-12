import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import './MessageBoard.css'
import { url } from '../../Url';


type MessageUpload = {
    id: number,
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

            const res = await fetch(`${url}/messages`, {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                }
            });

            const allMessages = await res.json() as {
                payload: MessageUpload[];
                status: string;
            };


            if(allMessages.status === "error"){

                alert("messages failed to load");

                return;
            };


            setAllMessages(allMessages.payload);

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
    
                setAllMessages(prev => [...prev, result.payload])
            }


        };
    };

    const deleteMessage = async (msg:MessageUpload) => {

        console.log(msg?.message)

        try{

            const res = await fetch(`${url}/messages/delete_message`, {

                method: 'POST',

                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${user?.token}`
                },

                body: JSON.stringify({msg})
            });

            const response = await res.json()

            console.log(response.payload.id)

            if(res.ok && response.status === "success"){

                setAllMessages(prevMsgs => prevMsgs.filter(msg => msg.id !== response.payload.id))

                alert("message deleted");
            
            }else{

                alert("failed to delete message");
            }
        
        }catch(err){

            console.log(err);
        }
    }



    return (

        <div className="d-flex flex-column h-100 pt-3 pb-3 gap-3 input-field">

                <div className="messages-sent">
                   
                    {allMessages.map((msg:MessageUpload, index:number) => {

                        return (
                            <div className="message-boxes d-flex flex-column lh-1 textarea-style mb-2 p-1" key={index}>
                                
                                <p className="d-flex flex-row justify-content-between"><b>{msg.username.split(' ')[0] + ' ' + msg.username.split(' ')[1][0]}</b><i>{msg.timestamp}</i>{user?.admin && <button className="message-box-delete align-self-end" onClick={() => deleteMessage(msg)}></button>}</p>
                                <p>{msg.message}</p>
                                
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