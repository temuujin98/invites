import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CreatorApp from './CreatorApp'

createRoot(document.getElementById('root')).render(<StrictMode><CreatorApp /></StrictMode>)
