import { useEffect } from "react";
import { React, useState } from "react";
import "./App.css"

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const[messageList,setMessageList]=useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:`${hours}:${minutes}`,
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
    }
  };

  useEffect(() => {
    const handleMessageReceive = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleMessageReceive);

    return () => {
      socket.off("receive_message", handleMessageReceive);
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>

      <div className="chat-body">
        {messageList.map((messageContent,index)=>{
            return <div className="message" id={username===messageContent.author ? "you" : "other"}>
                
                    <div className="message-content">
                        <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                        <p>{messageContent.time}</p>
                        <p>{messageContent.author}</p>
                    </div>
                
            </div>
        })}
      </div>

      <div className="chat-footer">
        <input
          type="text"
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
          value={currentMessage}
          placeholder="Type a message..."
        />
        
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
