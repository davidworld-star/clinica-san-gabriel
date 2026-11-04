import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'

import './styles/tokens.css'
import './styles/global.css'
import App from './App.jsx'
import { ClinicaProvider } from './context/ClinicaContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClinicaProvider>
      <App />
    </ClinicaProvider>
  </StrictMode>,
)
