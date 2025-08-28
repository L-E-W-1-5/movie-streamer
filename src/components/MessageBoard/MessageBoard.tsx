import './MessageBoard.css'


const MessageBoard = () => {
    return (
        <div className="d-flex flex-column h-100 pt-3 pb-3 gap-3">

                <textarea className="messages-sent input-field textarea-style" placeholder="messages will load here.." readOnly></textarea>

                <textarea className="send-message input-field textarea-style" placeholder="type your message here.."></textarea>

        </div>
    )
};

export default MessageBoard;