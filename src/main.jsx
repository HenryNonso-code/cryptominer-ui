import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ✅ Telegram WebApp user injection
const telegramUser = window?.TG_USER || null

// ✅ Log for debugging (remove in production)
console.log("Telegram User from WebApp:", telegramUser)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App telegramUser={telegramUser} />
  </StrictMode>
)
