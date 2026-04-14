import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PasswordGate from './PasswordGate.jsx'
import App from './App.jsx'
import PathDeep from './PathDeep.jsx'
import CreationDeep from './CreationDeep.jsx'
import LivingNetworkDeep from './LivingNetworkDeep.jsx'
import SeekerPage from './SeekerPage.jsx'
import FacilitatorPage from './FacilitatorPage.jsx'
import ContainerPage from './ContainerPage.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PasswordGate>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/path" element={<PathDeep />} />
          <Route path="/creation" element={<CreationDeep />} />
          <Route path="/living-network" element={<LivingNetworkDeep />} />
          <Route path="/seeker" element={<SeekerPage />} />
          <Route path="/facilitator" element={<FacilitatorPage />} />
          <Route path="/container" element={<ContainerPage />} />
        </Routes>
      </BrowserRouter>
    </PasswordGate>
  </React.StrictMode>
)
