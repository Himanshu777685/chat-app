import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ChatProvider } from './context/ChatContext.jsx'

import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ChatProvider>
        <PhotoProvider>
          <App />
        </PhotoProvider>
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>
)