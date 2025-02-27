import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Toaster} from "react-hot-toast"
import { BrowserRouter } from 'react-router-dom'
import { store } from './redux/Store.js'
import { Provider } from 'react-redux'
createRoot(document.getElementById('root')).render(

  
 <BrowserRouter>
 <Provider store={store}>
 <App />
   <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
 </Provider>
  
  </BrowserRouter>
  
 

   
)
