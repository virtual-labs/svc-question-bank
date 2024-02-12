// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { 
  getAuth, 
  connectAuthEmulator, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaDxmmM28cJeFoUN6q2VHxvHhCtVxHdhc",
  authDomain: "vlabs-test-on-personal-account.firebaseapp.com",
  projectId: "vlabs-test-on-personal-account",
  storageBucket: "vlabs-test-on-personal-account.appspot.com",
  messagingSenderId: "74241990122",
  appId: "1:74241990122:web:67860d860dd2bab9046693",
  measurementId: "G-P6XLF8YKNR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

function changeLogoutDisplay(option){
  const modal = document.querySelector('nav #logout');
  if(option == 0){
    modal.style.display = 'none';
  }
  else if(option == 0){
    modal.style.display = 'block';
  }
}
function changeLoginDisplay(option){
  const modal = document.querySelector('nav #login');
  if(option == 0){
    modal.style.display = 'none';
  }
  else if(option == 0){
    modal.style.display = 'block';
  }
}
function changeSignupDisplay(option){
  const modal = document.querySelector('nav #signup');
  if(option == 0){
    modal.style.display = 'none';
  }
  else if(option == 0){
    modal.style.display = 'block';
  }
}

// connectAuthEmulator(auth);

// remove the logout initially
const modal = document.querySelector('nav #logout');
modal.style.display = 'none';

// the even listener is not click but submit
// e is the event object
// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value; // Value from the ID of the signup email
  const password = signupForm['signup-password'].value; // Value from the ID of the signup password

  console.log(email, password);
  
  // sign up the user (async task)
  createUserWithEmailAndPassword(auth, email, password).then(cred => {
    // Add logout
    const modal1 = document.querySelector('nav #logout');
    modal1.style.display = 'block';

    // remove Signup
    const modal2 = document.querySelector('#login');
    modal2.style.display = 'none';
    
    // Remove Login 
    const modal3 = document.querySelector('#signup');
    modal3.style.display = 'none';

    console.log(cred);
  })
  // close the signup modal and reset the form
  const modal = document.querySelector("#modal-signup");
  M.modal.getInstance(modal).close();
  signupForm.reset();
})

const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) =>{
  e.preventDefault();
  signOut(auth).then(() => {
    const modal = document.querySelector('nav #logout');
    modal.style.display = 'none';

    const modal2 = document.querySelector('#login');
    modal2.style.display = 'block';

    const modal3 = document.querySelector('#signup');
    modal3.style.display = 'block';

    console.log("User logged out!");
  });
})

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) =>{
  e.preventDefault();
  const email    = loginForm['login-email']   .value;       // Value from the ID of the login email
  const password = loginForm['login-password'].value; // Value from the ID of the login password
  
  // get the user information
  signInWithEmailAndPassword(auth, email, password).then(cred => {
    // Add logout
    const modal1 = document.querySelector('nav #logout');
    modal1.style.display = 'block';

    // remove Signup
    const modal2 = document.querySelector('#login');
    modal2.style.display = 'none';
    
    // Remove Login 
    const modal3 = document.querySelector('#signup');
    modal3.style.display = 'none';
  
    console.log("User logged in!");
    console.log(cred.user);
  });
  // close the login modal and reset the form
  const modal = document.querySelector("#modal-login");
  M.modal.getInstance(modal).close();
  loginForm.reset();
})
