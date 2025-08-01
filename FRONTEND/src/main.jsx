import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'react-datepicker/dist/react-datepicker.css';
import { ThemeProvider } from './context/ThemeContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
    <App />
    </ThemeProvider>
  </StrictMode>,
)
