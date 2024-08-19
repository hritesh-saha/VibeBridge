const dotenv = require("dotenv");
dotenv.config();
const express=require("express");
const app=express();
const http=require("http");
const cors=require("cors");
const{Server}=require("socket.io");
const port=process.env.SERVER_PORT;
app.use(cors());

const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:"https://vibe-bridge-client.vercel.app/",
        methods:["GET","POST"],
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
        socket.join(data);
        console.log(`User with ID:${socket.id} joined Room ${data}`)
    })
})



server.listen(port,()=>{
    console.log("server is running");
})