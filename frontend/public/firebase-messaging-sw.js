importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCvw9R1-eDt_q9Z38R_UiULnuuvav7n5N0",
    authDomain: "jobbportal-ee406.firebaseapp.com",
    projectId: "jobbportal-ee406",
    storageBucket: "jobbportal-ee406.firebasestorage.app",
    messagingSenderId: "574976396640",
    appId: "1:574976396640:web:70c9db912876af647ce205",
    measurementId: "G-N3TH9PHX3Z"
  };

firebase.initializeApp(firebaseConfig)

const messaging=firebase.messaging();

messaging.onBackgroundMessage(function(payload){
    console.log("retrived message",payload);
})