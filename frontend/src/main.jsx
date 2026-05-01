import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import useThemeStore from "./store/themeStore";

// Apply initial theme
document.documentElement.className = useThemeStore.getState().theme;

// Subscribe to theme changes
useThemeStore.subscribe((state) => {
  document.documentElement.className = state.theme;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
