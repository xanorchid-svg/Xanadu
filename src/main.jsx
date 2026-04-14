import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import PathDeep from './PathDeep'
import CreationDeep from './CreationDeep'
import LivingNetworkDeep from './LivingNetworkDeep'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/path" element={<PathDeep />} />
        <Route path="/creation" element={<CreationDeep />} />
        <Route path="/living-network" element={<LivingNetworkDeep />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
