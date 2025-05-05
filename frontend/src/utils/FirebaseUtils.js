import {initializeApp} from "firebase/app"
import {getMessaging,getToken,onMessage} from "firebase/messaging"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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