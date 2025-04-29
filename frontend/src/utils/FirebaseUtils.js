import {initializeApp} from "firebase/app"
import {getMessaging,getToken,onMessage} from "firebase/messaging"

const firebaseConfig = {
    apiKey:import.meta.env.FIRBASE_API_KEY,
    authDomain: "jobbportal-ee406.firebaseapp.com",
    projectId: "jobbportal-ee406",
    storageBucket: "jobbportal-ee406.firebasestorage.app",
    messagingSenderId: "574976396640",
    appId: "1:574976396640:web:70c9db912876af647ce205",
    measurementId: "G-N3TH9PHX3Z"
  };

  const vapikey=import.meta.env.VAPIKEY;

  const app=initializeApp(firebaseConfig)

  const messaging=getMessaging(app)

  export const requestFcmToken= async()=>{

      return Notification.requestPermission().then(async(permission)=>{
        if(permission==="granted"){
            return await getToken(messaging,{vapikey})
            }
       else{
            console.log("Permission not granted")
           }         
      })
      .catch((error)=>{
        console.log(error)
      })
  }

  export const onMessageListener=()=>{
     return new Promise((resolve)=>{
      onMessage(messaging,(payload)=>{
         resolve(payload);
      })
     })
  }