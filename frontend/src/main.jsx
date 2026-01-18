import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './stylesheets/index.css'
import App from './components/App.jsx'
import { Auth0Provider } from "@auth0/auth0-react"
import { BrowserRouter } from "react-router-dom"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_DOMAIN}
      clientId={import.meta.env.VITE_CLIENTID}
      authorizationParams={{ redirect_uri: window.location.origin }}
      cacheLocation='localstorage'
      useRefreshTokens={true}>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
    </Auth0Provider>
  </StrictMode>
)

