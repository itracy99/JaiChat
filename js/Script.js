/*
GENERAL TODO:
JACOB:
  Update user fields
    bio, full_name, etc

  Update login status
    When user is registered, does it automatically run login func?
    TODO: Check if register will update online val
  
  Create Group chat
    ? Add to user-side groups array & to group-side

  Delete Chat - Make an admin of group?
    Onclick, set currentGroupId, so that when delete button pressed, it deletes currently opened chat?
    Update sidebar
    ? Permissions?

  Delete Messages - Only delete own + admin privileges?
    Onclick next to message
    Delete from group-side
    Update sidebar
    ? Permissions?

  Remove user from chat - Self vs admin
    Remove from user-side groups array & from group-side members
    Update sidebar
    ? Delete messages from deleted users?

  Populate db
    Last-ish step

  Password Reset
    Watch tutorial --> current breaks once sendReset...... func called



OTHERS:
  Search for other users

  Profile page/sidebar
    


where to input certain user profile fields (bio, full name, etc)
Search for other users? - primary field? (full name, email, ID?) --> If ID, make visible on profile page

Pull all groups user is a member of for sidebar nav --> handle case if none, too many, maybe sort by last login of users? last message?
*/


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
// TODO: create group chat functionality --> update currentGroupID when selecting different group chats. Var passed to fetch and post functions
var currentGroupID = '';

firebase.auth().onAuthStateChanged(function(user){
  if(user){
    document.getElementById("chat").style.display = "initial";
    document.getElementById("greyContainer").style.display = "initial";
    document.getElementById("container").style.display = "none";
    document.getElementById("container_createAccount").style.display = "none";

    var user = auth.currentUser; // TODO: what is stored here?

    if(user != null){
      var email = user.email;
      document.getElementById("user_para").innerHTML = "Welcome " + email
    }

  }else{
    document.getElementById("chat").style.display = "none";
    document.getElementById("container").style.display = "initial";
    document.getElementById("greyContainer").style.display = "none";
    document.getElementById("container_createAccount").style.display = "none";
  }
});

function tapped_dontHaveAccount(){
  document.getElementById("chat").style.display = "none";
  document.getElementById("container").style.display = "none";
  document.getElementById("greyContainer").style.display = "none";
  document.getElementById("container_createAccount").style.display = "initial";
};

function tapped_alreadyHaveAccount(){
  document.getElementById("chat").style.display = "none";
  document.getElementById("container").style.display = "initial";
  document.getElementById("greyContainer").style.display = "none";
  document.getElementById("container_createAccount").style.display = "none";
};

// TODO: Forgot Password

function forgot_password(){
//import { getAuth, sendPasswordResetEmail } from "firebase/auth"; // Needed?
  // alert('FORGOT PASSWORD')
  email = document.getElementById('email').value;
  //const auth = getAuth(); // Needed?
  //sendPasswordResetEmail(auth, email) // user, email ??
  sendPasswordResetEmail(email, )
    .then(() => {
      // Password reset email sent!
      alert('Password reset email sent');
    })
    .catch((error) => {
      alert('Error occured while attempting to send password reset email');
      const errorCode = error.code;
      const errorMessage = error.message;
    });
    alert('FORGOT PASSWORD');
  return
}


function setUserData () { // TODO: Should this function set new username, email, password?
  /*

  var user_data = {
    online: true
  }
  if (document.getElementById('new_bio').value) {
    bio = document.getElementById('new_bio').value;
    user_data['bio'] = bio;
  }


  if (document.getElementById('new_password').value){
    password = document.getElementById('new_password').value;
    // User firebase to reset password
  }

  if (document.getElementById('new_full_name').value){
    full_name = document.getElementById('new_full_name').value;    
    user_data['full_name'] = full_name;
  }

  if (document.getElementById('new_email').value){
    full_name = document.getElementById('new_email').value;    
    // User firebase to reset email // <-- is this possible?
  }

  database_ref.child('users/' + user.uid).set(user_data);


  */

}; // TODO: When do you add this?


function register () { // TODO: How does registering an account automatically log-in the user and show chat?
  // TODO: get value of username
  username = document.getElementById('username').value;
  email = document.getElementById('new_email').value;
  password = document.getElementById('new_password').value;
  // TODO: check if passwords match (currently only uses one instance of password)
  password2 = document.getElementById('confirm_password').value;


  if (password != password2) {
    alert('Passwords do not match')
    return
  }
  if (validate_email(email) == false ) {
    alert('Email is not valid')
    return 
  }
  if(validate_password(password) == false){
    alert('Password is not valid')
    return 
  }

  

  auth.createUserWithEmailAndPassword(email, password)
  .then(function() {
    var user = auth.currentUser

    var database_ref = database.ref()
    var group_array = new Array('everyone'); // create an array of groups, where all users are a part of "everyone" group

    var user_data = {
      username: username,
      email : email, 
      last_login : Date.now(),
      bio: "",
      online: true,
      groups: group_array,
      fullname: ""
      // TODO: add other data (username)
    }

    database_ref.child('users/' + user.uid).set(user_data)

    alert('User Created!!')


    // TODO: clear input fields
    document.getElementById('username').value         = '';
    document.getElementById('new_email').value        = '';
    document.getElementById('new_password').value     = '';
    document.getElementById('confirm_password').value = '';
    
    //location.href = 'index.html'
  })
  .catch(function(error) {
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
};

function login () { // TODO: register does not execute "log in" func
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

 

  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password are incorrect')
    return 
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    var user = auth.currentUser

    var database_ref = database.ref()

    var user_data = {
      last_login : Date.now(),
      online: true
    }

    database_ref.child('users/' + user.uid).update(user_data)

    // TODO: clear input fields
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';


    alert('User Logged In!!')
    
    // TODO: send to blank page with group chats on left side?

  })
  .catch(function(error) {
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
};

function logOut() { // TODO: currently, when user logs out, or screen changes from messaging, message that is typed but not sent is NOT DELETED (visible across logins)
  var user = auth.currentUser

  var database_ref = database.ref()

  auth.signOut().then(() => {
    alert('User Logged Out!!')

    var user_data = {
      online: false
    }
    database_ref.child('users/' + user.uid).update(user_data);
    // TODO: clear currentGroupID
    currentGroupID = '';
  }).catch((error) => {
    var error_code = error.code
    var error_message = error.message
    alert(error_message)
  });
}

/*
document.getElementById("send-message").addEventListener("submit", postChat); // 
function postChat(e) { // TODO: pass currentGroupID to post in correct group
  e.preventDefault();
  var user = auth.currentUser;
  var email = user.email;
  const timestamp = Date.now();
  const chatTxt = document.getElementById("chat-txt");
  const message = chatTxt.value;
  chatTxt.value = "";
  database.ref("messages/" + timestamp).set({
    user: email,
    msg: message,
  });
} */


document.getElementById("send-message").addEventListener("submit", postChat); // 
function postChat(e) { // TODO: pass currentGroupID to post in correct group
  var fetchChat_directory = "groups/" + currentGroupID + "/messages/"
  e.preventDefault();
  var user = auth.currentUser;
  var email = user.email;
  const timestamp = Date.now();
  const chatTxt = document.getElementById("chat-txt");
  const message = chatTxt.value;
  chatTxt.value = "";
  database.ref(fetchChat_directory + timestamp).set({
    sender_id: user.uid,
    msg: message,
    time_sent: timestamp
    // seen_by: //empty array?
  });
}


/*
const fetchChat = database.ref("messages/"); // groups/______/messages/
fetchChat.on("child_added", function (snapshot) { // TODO: pass currentGroupID to fetch correct group
  const messages = snapshot.val();
  const msg = "<li>" + messages.user + " : " + messages.msg + "</li>";
  document.getElementById("messages").innerHTML += msg;
}); */


var fetchChat_directory = "groups/" + currentGroupID + "/messages/" // TODO: UPDATE seen_by
var fetchChat = database.ref(fetchChat_directory); // groups/______/messages/
fetchChat.on("child_added", function (snapshot) { // TODO: pass currentGroupID to fetch correct group
  const messages = snapshot.val();
  const msg = "<li>" + messages.user + " : " + messages.msg + "</li>";
  document.getElementById("messages").innerHTML += msg;
});

function delete_message() { // deletes individual message from database
// TODO: permissions?
  // get focused message
}

function delete_group() { // completely deletes the groupchat
// TODO: admin permissions?
  // get focused group


}

function create_group() { // create a new group
// self id is set as admin?


// get all users to be added to group?
  var user = auth.currentUser

  var database_ref = database.ref()
  var members_array = new Array(user.uid); // create an array of groups, where all users are a part of "everyone" group
  var messages_array = new Array();
  messages_array[0] = new Map();
  messages_array[0]['time_sent'] = Date.now();
  messages_array[0]['message_body'] = "Welcome to your new group chat :)";
  messages_array[0]['sender_id'] = user.uid;
  messages_array[0]['seen_by'] = user.uid;
  var group_data = {
    admin: user.uid,
    members: members_array,
    messages: messages_array,
    group_name: user.username + "'s group"
  }

  database_ref.child('groups/' + user.uid + Date.now).set(group_data)

  alert('Group Created!!')
}

function add_user_to_group() { // anyone can do
//// find user to add

// get userId from selected element

//// set group

// dropdown?


//// edit group table

// add user id to array of users in group --> edit name?

//// edit new user table 

// add groupid to array of groups in user


}

function remove_user_from_group() { // admin only?
// find user to remove
// set group
// edit group table
// edit removed user table
}

function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    return true
  } else {
    return false
  }
}

function validate_password(password) { //TODO: update password specifics
  if (password < 6) { // TODO: Should we check other password specifics?
    return false
  } else {
    // TODO: Add more cases of valid passwords?
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