var firebaseConfig = {
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
const auth = firebase.auth()
const database = firebase.database()

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

    var user_data = {
      email : email, 
      last_login : Date.now()
    }

    database_ref.child('users/' + user.uid).set(user_data)

    alert('User Created!!')
    //location.href = 'index.html'
  })
  .catch(function(error) {
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}
function logOut () {
  location.href = 'signIn.html'
}

function login () {
  email = document.getElementById('email').value
  password = document.getElementById('password').value

  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
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
    //location.href = 'index.html'

  })
  .catch(function(error) {
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
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