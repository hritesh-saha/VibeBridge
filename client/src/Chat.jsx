import { useEffect, useRef } from "react";
import { React, useState } from "react";
import "./App.css"

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const[messageList,setMessageList]=useState([]);
  const chatEndRef = useRef(null); // Reference for the end of the chat

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
      setCurrentMessage("");
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

  useEffect(() => {
    // Scroll to the bottom of the chat whenever messageList changes
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Vibe Bridge</p>
      </div>

      <div className="chat-body">
        {messageList.map((messageContent, index) => {
          // Check if the message is from "System"
          const isSystemMessage = messageContent.author === "System";

          return (
            <div
              className="message"
              id={isSystemMessage ? "system" : username === messageContent.author ? "you" : "other"}
              key={index}
            >
              <div className={`message-content ${isSystemMessage ? "system-message" : ""}`}>
                <p>{messageContent.message}</p>
              </div>
              {!isSystemMessage && (
                <div className="message-meta">
                  <p>{messageContent.time}</p>
                  <p>{messageContent.author}</p>
                </div>
              )}
            </div>
          );
        })}
        <div ref={chatEndRef} /> {/* Empty div for scrolling to the bottom */}
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
