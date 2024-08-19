import './App.css';
import io from 'socket.io-client'
import { useState } from 'react';
import Chat from './Chat';

const socket=io.connect("https://vibe-bridge-server.vercel.app/");

function App() {
 const [form,setForm]=useState({username:"",room:""});
 const[showChat,setShowChat]=useState(false);

 
 const handleChange=(e)=>{
  setForm({...form,[e.target.name]:e.target.value})
 }
 const joinRoom=()=>{
  if(form.username!==""&&form.room!==""){
    socket.emit("join_room",form.room)
    setShowChat(true)
  }
  //setForm({username:"",room:""})
 }

  return (
    
    <div className="App">
      {!showChat?(
      <div className="joinChatContainer">
      <h3>VibeBridge</h3>
      <input type="text" value={form.username} name='username' onChange={handleChange} placeholder="Username" />
      <input type="text" value={form.room} name='room' onChange={handleChange} placeholder='Room ID' />
      <button onClick={joinRoom}><span>Join Room</span></button>
      </div>
      ):
      (<Chat username={form.username} room={form.room} socket={socket}/>)}
      
    </div>
  );
}

export default App;
