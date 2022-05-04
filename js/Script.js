
const firebaseConfig = {
    apiKey: "AIzaSyCPMUGPrljaQhxxnV8cij4FaKTk1CQKYzY",
    authDomain: "jaichat-1c155.firebaseapp.com",
    databaseURL: "https://jaichat-1c155-default-rtdb.firebaseio.com",
    projectId: "jaichat-1c155",
    storageBucket: "jaichat-1c155.appspot.com",
    messagingSenderId: "120590499036",
    appId: "1:120590499036:web:d63b4114eed180b4818819",
    measurementId: "G-BY44YBBWHG"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

firebase.auth().onAuthStateChanged(function(user){
  if(user){
    document.getElementById("chat").style.display = "initial";
    document.getElementById("greyContainer").style.display = "initial";
    document.getElementById("greyContainerLeft").style.display = "initial";
    document.getElementById("greyContainerRight").style.display = "initial";
    document.getElementById("container").style.display = "none";
    document.getElementById("container_createAccount").style.display = "none";

    var user = auth.currentUser;

    if(user != null){
      var email = user.email;
      document.getElementById("user_para").innerHTML = "Welcome " + email
    }

  }else{
    document.getElementById("chat").style.display = "none";
    document.getElementById("container").style.display = "initial";
    document.getElementById("greyContainer").style.display = "none";
    document.getElementById("greyContainerLeft").style.display = "none";
    document.getElementById("greyContainerRight").style.display = "none";
    document.getElementById("container_createAccount").style.display = "none";
  }
});

function tapped_dontHaveAccount(){
  document.getElementById("chat").style.display = "none";
  document.getElementById("container").style.display = "none";
  document.getElementById("greyContainer").style.display = "none";
  document.getElementById("greyContainerLeft").style.display = "none";
    document.getElementById("greyContainerRight").style.display = "none";
  document.getElementById("container_createAccount").style.display = "initial";
};

function tapped_alreadyHaveAccount(){
  document.getElementById("chat").style.display = "none";
  document.getElementById("container").style.display = "initial";
  document.getElementById("greyContainer").style.display = "none";
  document.getElementById("greyContainerLeft").style.display = "none";
  document.getElementById("greyContainerRight").style.display = "none";
  document.getElementById("container_createAccount").style.display = "none";
};

function register () {
  email = document.getElementById('new_email').value
  password = document.getElementById('new_password').value

  if (validate_email(email) == false ) {
    alert('Email is not valid')
    return 
  }
  if(validate_password(password) == false){
    alert('password is not valid')
    return 
  }

  auth.createUserWithEmailAndPassword(email, password)
  .then(function() {
    var user = auth.currentUser

    var database_ref = database.ref()
    var emails = emailStrip(email);
    var user_data = {
      email : emails, 
      last_login : Date.now(),
      uid : user.uid
    }
    
    database_ref.child('users/' + emails).set(user_data)

    
    //location.href = 'index.html'
  })
  .catch(function(error) {
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
};

function login () {
  var email = document.getElementById('email').value
  var password = document.getElementById('password').value

  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password are incorrect')
    return 
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    var user = auth.currentUser

    var database_ref = database.ref()

    var user_data = {
      last_login : Date.now()
    }

    database_ref.child('users/' + user.uid).update(user_data)

    alert('User Logged In!!')


  })
  .catch(function(error) {
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}

function logOut() {
  auth.signOut().then(() => {
    alert('User Logged Out!!')
  }).catch((error) => {
    var error_code = error.code
    var error_message = error.message
    alert(error_message)
  });
}

var modal = document.getElementById('groupFormDiv');
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function showLog(){
  document.getElementById('groupFormDiv').style.display='block'
}

function hideLog(){
    document.getElementById('groupFormDiv').style.display='none'
}



document.getElementById("send-message").addEventListener("submit", postChat);
function postChat(e) {
  e.preventDefault();
  var user = auth.currentUser;
  var email = user.email;
  var emails = emailStrip(email);
  const timestamp = Date.now();
  const chatTxt = document.getElementById("chat-txt");
  const message = chatTxt.value;
  chatTxt.value = "";
  var messageAmount = getCount();
  if(!messageAmount){
    messageAmount = 0;
  }

  var fetchChat = database.ref("users/" + emails + "/");
  fetchChat.once("value").then( function (snapshot) {
    var messages = snapshot.key;
    name = snapshot.child("groups/groupID").val();

    var charal = emails + "=";
    var charal2 = "=" + emails;
    var otherEmail = name.replace(charal, "");
    otherEmail = otherEmail.replace(charal2, "");

      database.ref("users/" + emails +"/groups/messages/"+ messageAmount + "/").set({
        msOrder: messageAmount,
        user: email,
        msg: message,
        time: timestamp
      });

      database.ref("users/" + otherEmail +"/groups/messages/"+ messageAmount + "/").set({
        msOrder: messageAmount,
        user: email,
        msg: message,
        time: timestamp
      });

      database.ref("groups/"+emails +"/groups" ).set({
        lastMsg: message,
      });

  });


}




document.getElementById("createGroupForm").addEventListener("submit", createGroupChat);
function createGroupChat(e){
  e.preventDefault();
  var user = auth.currentUser;
  var email = user.email;
  var emails = emailStrip(email);
  const timestamp = Date.now();
  var otherUser = document.getElementById("createGroup-email").value;
  var otherUsers = emailStrip(otherUser);


  var name = emails +  "=" + otherUsers;
  var charal = emails + "=";
  var otherEmail = name.replace(charal, "");
 
  
  database.ref("users/" + emails +"/groups/").set({
    groupID : name,
    groupName: name,
    sender: emails,
    reciever: otherUsers,
    time: timestamp,
  });

  database.ref("users/" + otherEmail +"/groups/").set({
    groupID : name,
    groupName: name,
    sender: otherUsers,
    reciever: emails,
    time: timestamp,
  });
  
}

function getCount(){
  var count;
  var user = auth.currentUser;
  var email = user.email;
  var emails = emailStrip(email);
  const fetchChat = database.ref("users/" + emails);
  fetchChat.on("child_added", function (snapshot) {
    const messages = snapshot.val();
    count = Object.keys(messages.messages).length;
  });
  return count;
}
msg = "<li class=\"sentMessage\"> albert@gmail.com : Hello </li>";
  document.getElementById("messages").innerHTML += msg;
  msg = "<li class=\"receivedMessage\"> ian@gmail.com : How is it going? </li>";
  document.getElementById("messages").innerHTML += msg;

const fetchChat = database.ref("users/");
fetchChat.on("child_added", function (snapshot) {
  var userG = auth.currentUser;
  var emailG = userG.email;
  var emailsG = emailStrip(emailG);




});
const chats = "<button> itracy@gmail.com <br> How is it going? </button>";
  document.getElementById("groupChats").innerHTML += chats;
const fetchGroupChats = database.ref("users/" + emailsG);
fetchGroupChats.on("child_added", function (snapshot) {
  const username = snapshot.val();
  const chats = "<button>" + username.reciever + "<br>" + username.lastMsg.lastMsg+ "</button>";
  document.getElementById("groupChats").innerHTML += chats;
});

function emailStrip(email){
  var emails = email.replace("@", "_");
  var emails = emails.replace(".", "-");

  return emails;
}

function validate(email) {
  var isThere = false;
  const fetchChat = database.ref("users/" + emailsG +"/groups/");
    fetchChat.on("child_added", function (snapshot) {
    const user = snapshot.val();
    if(user.email == email){
      isThere = true;
    }
  });
    return isThere;
    
}

function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    return true
  } else {
    return false
  }
}

function validate_password(password) {
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}