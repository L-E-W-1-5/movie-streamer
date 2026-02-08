import { useContext, useEffect, useState, useRef } from 'react';
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

type MessageBoardProps = {
    setMessageSlide: React.Dispatch<React.SetStateAction<boolean>>
}

const MessageBoard: React.FC<MessageBoardProps> = ({ setMessageSlide }) => {

    const { user } = useContext(UserContext);

    const [allMessages, setAllMessages] = useState<Array<MessageUpload>>([]);

    const [message, setMessage] = useState<string>('');

    const [messageBox, setMessageBox] = useState<string>("30px")

    const messageBoard = useRef<HTMLDivElement>(null)



    useEffect(() => {

        if(messageBoard.current){

            messageBoard.current.style.setProperty("display", "none", "important")
        }

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

        if(!confirm("are you sure you wish to delete this message?")){

            return;
        }

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


    const expandMessageBox = () => {

        const screenWidth = window.screen.width;

        const messageWidth = messageBox.match(/\d+/g)

        if(Number(messageWidth![0]) < 50){

            if(messageBoard.current){

                messageBoard.current.style.setProperty("display", "flex", "important")
            }

            if(screenWidth < 500){

                setMessageBox("100%")

                setMessageSlide(true);
            }
            else{

                setMessageBox("300px")
            }

            //setMessageBox(330);
        }
        else{
 
            setMessageBox("30px")

            setMessageSlide(false);

            if(messageBoard.current){

                messageBoard.current.style.setProperty("display", "none", "important")
            }
        }
    }



    return (
        <div className="dashboard-message-container border-shadow" 
            style={{maxWidth: messageBox}} 
        >
            <div className="message-expand-bar mr-2" onClick={expandMessageBox}><h4 className="text-rotate">messages</h4></div>

            <div className="message-list-container d-flex flex-column h-100 p-2 gap-3 input-field" ref={messageBoard}>

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

        </div>
    )
};

export default MessageBoard;

// className="messages-sent input-field textarea-style border-shadow p-1"