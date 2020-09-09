var mongoClient = require("mongodb").MongoClient;
var messageObj = require("./messageManagement");


const users = [];

function newUserJoin(id,username,room){
	console.log("new user join called");
	var user = {id,username,room};
	mongoClient.connect("mongodb://127.0.0.1:27017/",{ useUnifiedTopology: true },(err,dbHost)=>{
		if(err){

		}else{
			db = dbHost.db("slDb");
			db.collection("users",(err,coll)=>{
				if(err){

				}else{
					coll.insertOne(user);	
				}
				
			})
		}
	})
	// users.push(user);
};

function getAllUsers(room,returnResult){
	mongoClient.connect("mongodb://127.0.0.1:27017/",{ useUnifiedTopology: true },(err,dbHost)=>{
		if(err){
			console.log("error connecting to db");
		}else{
			db = dbHost.db("slDb");
			db.collection("users",(err,coll)=>{
				if(err){
					returnResult([]);
				}else{
					console.log("finding users in room : ",room);
					coll.find({room:room},{username:1,_id:0}).toArray((err,dataArr)=>{
						if(err){
							console.log("error in find users",err);
							returnResult([]);
						}else{
							console.log("users in a particular room",dataArr);
							returnResult(dataArr);
						}
					})	
				}
				
			})
		}
	})
}

// function toRet(data){
// 	return data;
// }

// function getUser(id){

// 	mongoClient.connect("mongodb://127.0.0.1:27017/",{ useUnifiedTopology: true },(err,dbHost)=>{
// 		if(err){

// 		}else{
// 			db = dbHost.db("slDb");
// 			db.collection("users",(err,coll)=>{
// 				if(err){

// 				}else{
// 					coll.findOne({id:id},(err,res)=>{
// 						if(err){
// 							console.log(error);
// 						}else{
// 							console.log(res);
// 							return toRet(res);			
// 							// var pos = users.findIndex(item=> item.id == id);
// 							// if(pos>=0){
// 							// 	return users[pos];
// 							// }

// 						}
// 					});	
// 				}
				
// 			})

// 		}
// 	})

	// var pos = users.findIndex(item=> item.id == id);
	// if(pos>=0){
	// 	return users[pos];
	// }


// }

function removeUser(socketId,socket,io){
	mongoClient.connect("mongodb://127.0.0.1:27017/",{ useUnifiedTopology: true },(err,dbHost)=>{
		if(err){

		}else{
			db = dbHost.db("slDb");
			db.collection("users",(err,coll)=>{
				if(err){

				}else{
					coll.findOneAndDelete({id:socketId},(err,res)=>{
						if(err){
							console.log("error during deletion");
						}else{
							console.log(res.value);
							var tempUser = res.value;
							var obj = {username:tempUser.username,message:" has left the room",room:tempUser.room};
    						messageObj.postMessage(obj);
      						socket.to(tempUser.room).broadcast.emit("modifyUserJoinMessage",obj);
      						var users = getAllUsers(tempUser.room,(p1)=>{
						      if(p1.length == 0){
						        console.log("error in retreiving the docs")
						      }else{
						        console.log(p1);
						        io.to(tempUser.room).emit("modifyUserList",p1);
						      }
						    })
    						
						}
					})	
				}
				
			})
		}
	})

}

module.exports = {newUserJoin,getAllUsers,removeUser};