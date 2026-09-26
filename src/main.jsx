import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.warn('VITE_GOOGLE_CLIENT_ID est absent : la connexion Google est désactivée.');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId || 'google-login-disabled'}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)