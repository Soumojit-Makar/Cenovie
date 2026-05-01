import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" toastOptions={{
          style: { background: '#fff', color: '#1e293b', border: '1px solid #e2e8f0', fontSize: '13px' },
          success: { iconTheme: { primary: '#00a896', secondary: '#fff' } },
        }} />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
