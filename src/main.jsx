import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Hardcoded configuration for user convenience
// Hardcoded configuration for user convenience
const USER_PROVIDED_KEY = "AIzaSyBTzBgjW08QCXGhTRAP1KXyg4t4P2q4ULM";
// Always update to ensure we use the new working key
localStorage.setItem('google_gemini_api_key', USER_PROVIDED_KEY);
console.log("Auto-configured Google AI Key (Billed)");

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
