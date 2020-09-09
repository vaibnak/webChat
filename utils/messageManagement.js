var mongoClient = require("mongodb").MongoClient;

messageArr=[];

function postMessage(obj){

	console.log("from postMessage", obj);

	if(obj != undefined){
		mongoClient.connect("mongodb://127.0.0.1:27017/",{ useUnifiedTopology: true },(err,dbHost)=>{
			if(err){

			}else{
				db = dbHost.db("slDb");
				db.collection("messages",(err,coll)=>{
					if(err){

					}else{
						coll.insertOne(obj);	
					}
					
				})
			}
		})	
	}
	

	messageArr.push(obj);
}

function getAllMessages(){
	return messageArr;
}

module.exports={postMessage:postMessage,getAllMessages};