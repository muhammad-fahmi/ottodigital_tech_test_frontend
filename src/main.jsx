import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import GiftCard from './GiftCard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GiftCard />
  </StrictMode>,
)
