import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import { SidebarProvider,SidebarInset, } from "@/components/ui/sidebar"

import AppHeader from './components/common/app-header';
import  AppSidebar from "./components/common/app-sidebar"
import About from './pages/patients/Acceuil';
import ProfilPatient from './pages/patients/ProfilPatient';
import DashboardPatient from './pages/patients/DashboardPatient';
import HistoriqueRdvCard from './components/rdv/HistoriqueRdvCard';
import Login from './pages/auth/Login';
import LoginPage from '@/app/login/page';
import Agenda from './pages/agenda/Angeda';

function App() {  
  const location = useLocation(); // route actuelle

  const isLoginPage = location.pathname === '/login';


  return (
    <SidebarProvider>
      {!isLoginPage && <AppSidebar />}
      <SidebarInset>
        {!isLoginPage && <AppHeader />}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Routes>
            {/* Routes existantes */}
            <Route path="/" element={<ProfilPatient />} />
            <Route path="/about" element={<About />} />
            <Route path="/historique/rdv" element={<DashboardPatient />} />
            <Route path="/historique/rdv/:id" element={<HistoriqueRdvCard />} />
            {/* Route pour la page de connexion */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/agenda" element={<Agenda />} />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
