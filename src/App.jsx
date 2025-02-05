import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import { SidebarProvider,SidebarInset, } from "@/components/ui/sidebar"

import AppSidebar from "./components/common/app-sidebar"
import AppHeader from './components/common/app-header';
import HistoriqueRdvCard from './components/rdv/HistoriqueRdvCard';
import LoginPage from '@/app/login/login-page';
import SignInPage from './app/login/signin-page';
import Acceuil from './pages/patients/Acceuil';
import Agenda from './pages/agenda/Angeda';
import ProfilPatient from './pages/patients/ProfilPatient';
import DashboardPatient from './pages/patients/DashboardPatient';

function App() {  
  const location = useLocation(); // route actuelle

  const isLoginPage = location.pathname === '/login' || location.pathname === '/signin';


  return (
    <SidebarProvider>
      {!isLoginPage && <AppSidebar />}
      <SidebarInset>
        {!isLoginPage && <AppHeader />}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Routes>
            {/* Route pour la page de connexion et inscription */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signin" element={<SignInPage />} />
            {/* Routes existantes */}
            <Route path="/" element={<Acceuil />} />
            <Route path="/about" element={<ProfilPatient />} />
            <Route path="/historique/rdv" element={<DashboardPatient />} />
            <Route path="/historique/rdv/:id" element={<HistoriqueRdvCard />} />
            <Route path="/agenda" element={<Agenda />} />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
