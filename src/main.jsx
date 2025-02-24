import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import Accueil from './pages/accueil/Accueil.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/medicalReact'>
    <Accueil />
  </BrowserRouter>,
)
