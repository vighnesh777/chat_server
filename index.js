
const express=require("express");
const app=express();
const http=require("http");
const cors=require("cors");
const port=process.env.PORT || 8081;

app.use(cors());
app.use(express.json());
const {Server}=require("socket.io");
app.use(express.urlencoded({extended:true}));
let roomsAvailable=["room1room","room2room"];
function isRoomAvailable(room){
  return roomsAvailable.includes(room);
}
const server = http.createServer(app);
const io=new Server(server,{
    cors:{
        origins:"*:*",
    methods:["GET","POST"],
    }
});
io.on("connection",(socket)=>{
    console.log("a user connected",socket.id);
    
    socket.on("join",(data)=>{
        if(isRoomAvailable(data.room)){

        console.log(data.name,"has joined",data.room);

        socket.join(data.room);
        }
        else
        {
            socket.emit("error","Room not available");
            console.log("Room not available");
        }
        
});
    socket.on("sendMessage",(data)=>{
        console.log(data);
        socket.to(data.room).emit("recieveMessage",data);
    });
    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id);
    }
    );
}
);


server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
}
);
