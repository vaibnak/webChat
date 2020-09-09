var chatForm = document.getElementById("chatForm");
var chatmessage = document.getElementById("textChatMessages");
var chatMessagesDiv = document.getElementById("chatMessagesDiv");
var roomInfo = document.getElementById("roomInfo");

var userObject = Qs.parse(location.search,{ignoreQueryPrefix:true});
var username = userObject.username;
var room = userObject.room;


console.log("username: ",username);
console.log("room: ",room);
var socket = io();

socket.on('connect', function(){ 
  console.log('Connected to Server') 
}); 

socket.emit("joinRoom",{username:username,room:room});

socket.on("welcomeUser",(msg)=>{
  chatmessage.innerHTML += msg;
  roomInfo.innerHTML += room;

})

socket.on("chatMessage",(obj)=>{
	formatMessage(obj); 
});

socket.on("modifyUserJoinMessage",(obj)=>{
	var paraElement = document.createElement("p")
	paraElement.className = "text-center";
	paraElement.style["color"] = "red";
	var str = obj.username+" "+obj.message;
	var pTextNode = document.createTextNode(str);
	paraElement.appendChild(pTextNode);
	chatMessagesDiv.appendChild(paraElement);
});

socket.on("modifyUserList",(data)=>{
   	var ul = document.getElementById("userList");
   	ul.innerHTML = "";
   	for(var i=0;i<data.length;i++){
   		var li = document.createElement("li");
    	li.appendChild(document.createTextNode(data[i].username));	
   		ul.appendChild(li);
   	}
    console.log("allusers", data);
 });

function formatMessage(obj){
	var paraElement = document.createElement("div");
	// paraElement.style["overflow-y"] = "auto";
	if(obj.username == username){
		obj.username = "You";
	}
	var str = obj.username+" : "+obj.message;
	if(obj.username == "You"){
		paraElement.className= "text-right";
	}else{
		paraElement.className = "text-left";
	}
	var pTextNode = document.createTextNode(str);
	paraElement.appendChild(pTextNode);
	chatMessagesDiv.appendChild(paraElement);

}



function sendMessageEventHandler(){
	console.log("send message called");
  socket.emit("message",{message:chatmessage.value,username:username,room:room});
  chatmessage.innerHTML = "";
}


