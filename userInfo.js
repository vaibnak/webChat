const users = [];

function newUserJoin(id,username){
	var user = {id,username};
	users.push(user);
};

function getAllUsers(){
	return users;
}

function getUser(){
	var pos = users.findIndex(item=>item.id == id);
	if(pos>=0){
		return users[pos];
	}else{
		return numm;
	}
}

function removeUser(id){
	var pos = users.findIndex(item=>item.id == id);
	if(pos>=0){
		return users.splice(pos,1);
	}
}

module.exports = {newUserJoin,getAllUsers,getUser,removeUser};