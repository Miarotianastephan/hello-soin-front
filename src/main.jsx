import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
// import Accueil from './pages/accueil/Accueil.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/medicalReact'>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>,
)
