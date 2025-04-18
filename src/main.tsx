
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initSentry } from './integrations/sentry/config'

// Initialize Sentry before rendering the app
initSentry();

createRoot(document.getElementById("root")!).render(<App />);
