import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Amplify } from 'aws-amplify';
import amplifyConfig from './auth/amplifyConfig.ts';
import { AuthProvider } from './auth/AuthContext.tsx';

Amplify.configure(amplifyConfig);


createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
)
