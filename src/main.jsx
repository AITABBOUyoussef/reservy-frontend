import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// 1. Zid had l'import lfo9
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Ghlef l'App b had l'Provider w 7et fih l'ID Client dyalek */}
    <GoogleOAuthProvider clientId="844311899042-bovshhuojupk3hs39hj0tssnorhjnpvt.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)