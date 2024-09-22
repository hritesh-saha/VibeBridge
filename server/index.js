const dotenv = require("dotenv");
dotenv.config();
const express=require("express");
const app=express();
const http=require("http");
const cors=require("cors");
const{Server}=require("socket.io");
const port=process.env.SERVER_PORT;
const corsOptions = {
    origin:"http://localhost:3000/",
    methods:["GET", "POST"],
    credentials: true
};
app.use(cors(corsOptions));

const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:"http://localhost:3000/",
        methods:["GET","POST"],
        credentials: true
    }
})

io.on("connection",socket=>{
    console.log(`User connected: ${socket.id}`);

    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id);
    })

    socket.on("send_message",(data)=>{
        socket.to(data.room).emit("receive_message",data)
    })

    socket.on("join_room",(data)=>{
        socket.join(data.room);
        console.log(`User with ID:${data.username} joined Room ${data.room}`);
        const roomData=data.room;

        const systemMessage = {
            room: roomData,
            author: "System",
            message: `User ${data.username} has joined the room ${roomData}`,
            time: new Date().toLocaleTimeString(),
            system: true // Mark this message as a system message
        };

        io.in(data.room).emit("receive_message", systemMessage); // Send the system message to everyone in the room
    })
})



server.listen(port,()=>{
    console.log("server is running");
})