import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Auth0Provider
        domain="dev-6wqphjmijo4tjbxf.us.auth0.com"
        clientId="SvyXNFWimpxozzVvW7wIrZv7Moqgb3Z7"
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
    >
      <App />
    </Auth0Provider>
)
