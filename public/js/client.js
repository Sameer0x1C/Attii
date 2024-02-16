const socket = io();

var username;
var chats = document.querySelector(".chats");
var userList = document.querySelector(".users-list");
var usersCount = document.querySelector(".users-count");
var msg_send = document.querySelector("#user_send");
// var user_msg = document.querySelector("#user_msg"); 



do{
    username = prompt("Enter your name");
}while(!username);

// It will be called when an user joins the chat //

socket.emit("new-user-joined",username); 

// Notify the users when new user gets connected and disconnected//

socket.on("user-connected",(socket_name)=>{
    userJoinandLeft(socket_name,"joined");
});

socket.on("user-disconnected",(user)=>{
    userJoinandLeft(user,"left");
});

// Updates the User list with Names and No.of.Users

socket.on("user-list",(users)=>{
    userList.innerHTML="";
    var users_arr=Object.values(users);
    for(i=0;i<users_arr.length;i++){
        let p=document.createElement('p');
        p.innerText=users_arr[i];
        userList.appendChild(p);
    }
    usersCount.innerHTML=users_arr.length;
});

// Function to create new div for alerts

function userJoinandLeft(name,status){
    let div = document.createElement("div");
    div.classList.add("user-joined");
    let content = `<p><b>${name}</b> ${status} the chat</p>`;
    div.innerHTML=content;
    chats.appendChild(div);
}

// For sending messages //

document.querySelector("body").addEventListener("keypress",(e)=>{
    var user_msg = document.querySelector("#user_msg");
    let data = {
        user: username,
        msg: user_msg.value

    };
    if(user_msg.value!='' && e.key == "Enter"){
        appendMessage(data,'outgoing');
        socket.emit('message',data);
        user_msg.value = "";
    }
});

msg_send.addEventListener("click",()=>{
    var user_msg = document.querySelector("#user_msg");
    let data = {
        user: username,
        msg: user_msg.value

    };
    if(user_msg.value!=''){
        appendMessage(data,'outgoing');
        socket.emit('message',data);
        user_msg.value = "";
    }
});

function appendMessage(data,status){
    let div = document.createElement("div");
    div.classList.add("message",status);
    let content = `
    <h5>${data.user}</h5>
    <p>${data.msg}</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTo(0,document.querySelector('.chats').scrollHeight);

}

socket.on("message",(data)=>{
    appendMessage(data,'incoming');
});