var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var http = require("http");
var socketio = require("socket.io");
var queryString = require("querystring");
var userObj = require("./utils/userInfo");
var messageObj = require("./utils/messageManagement");

const PORT=3000;

var app = express();
const server = http.createServer(app);
var io = socketio(server);

app.use(express.static(path.join(__dirname,"public")))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

app.get("/",(req,res)=>{
  var fileUrl = path.join(__dirname,"public","index.html");
  res.sendFile(fileUrl);
})

app.post("/home",(req,res)=>{
  console.log("in home");
  var username = req.body.username;
  var room = req.body.room;
  console.log(req.body);
  // res.send("good work")
  var tmp = queryString.stringify({username:username,room:room});
  res.redirect("/chat?"+tmp);
});

app.get("/chat",(req,res)=>{
  var fileUrl=path.join(__dirname,"public","chat.html")
  res.sendFile(fileUrl);
})

io.on("connection",(socket)=>{
  console.log("connection done")
  socket.on("joinRoom",(data)=>{
    console.log(data);
    socket.join(data.room)
    userObj.newUserJoin(socket.id,data.username,data.room);
    
    socket.emit("welcomeUser","welcome to the Room");
    var obj = {username:data.username,message:" has joined the room",room:data.room}
    messageObj.postMessage(obj);
    socket.to(data.room).broadcast.emit("modifyUserJoinMessage",obj);
    userObj.getAllUsers(data.room,(p1)=>{
      if(p1.length == 0){
        console.log("error in retreiving the docs")
      }else{
        console.log(p1);
        io.to(data.room).emit("modifyUserList",p1);
      }
    });
    
  })

  socket.on("disconnect",()=>{
    console.log("user has left");
    userObj.removeUser(socket.id, socket, io);
    // var tempUser = userObj.getUser(socket.id);
    // console.log("tempUser form index.js");
    // console.log(tempUser);
    // if(tempUser != undefined){
    //   userObj.removeUser(socket.id);
    //   var obj = {username:tempUser.username,message:" has left the room"};
    //   messageObj.postMessage(obj);
    //   socket.to(tempUser.room).broadcast.emit("modifyUserJoinMessage",obj);
    //   var allUsers = userObj.getAllUsers();
    //   io.to(tempUser.room).emit("modifyUserList",allUsers);
    // }
    

  })

  socket.on("message",(obj)=>{
    messageObj.postMessage(obj);
    console.log("Message received",obj);
    io.to(obj.room).emit("chatMessage",obj);
    console.log("All message ", messageObj.getAllMessages());
    console.log("all users in the room");
    userObj.getAllUsers(obj.room,(p1)=>{
      if(p1.length == 0){
        console.log("error in retreiving the docs")
      }else{
        console.log(p1);
      }
    });
  })




})

server.listen(PORT,(err)=>{
  if(!err){
      console.log("server started at port 3000");
  }
})