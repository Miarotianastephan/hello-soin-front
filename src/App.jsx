import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import { SidebarProvider,SidebarInset, } from "@/components/ui/sidebar"

import AppSidebar from "./components/common/app-sidebar"
import AppHeader from './components/common/app-header';
import HistoriqueRdvCard from './components/rdv/HistoriqueRdvCard';
import LoginPage from '@/pages/login/login-page';
import SignInPage from './pages/login/signin-page';
import AccueilPraticien from './pages/praticien/AccueilPraticien';
import Pratiques from './pages/praticien/Pratiques';
import Agenda from './pages/disponibilite/agenda/agenda';
import ProfilPatient from './pages/patients/ProfilPatient';
import DashboardPatient from './pages/patients/DashboardPatient';
import PraticienProfil from './pages/praticien/PraticienProfil';
import Disponibilités from './pages/disponibilite/disponibilite';
import Crenaux from './pages/crenaux/crenaux';
import Accueil from './pages/accueil/Accueil';

function App() {  
  const location = useLocation(); // route actuelle

  const isLoginPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signin';


  return (
    <SidebarProvider>
      {!isLoginPage && <AppSidebar />}
      <SidebarInset>
        {!isLoginPage && <AppHeader />}
        <div className="">
          <Routes>
            {/* Pages d'inscription et de connexion */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signin" element={<SignInPage />} />
            {/* Les pages de navigations */}

            {/* Accueil principale de l'application */}
            <Route path="/" element={<Accueil />} />


            {/* PRATICIEN */}
            <Route path="/praticien/dashboard" element={<AccueilPraticien />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/pratiques" element={<Pratiques />} />
            <Route path="/profil" element={<PraticienProfil />} />
            <Route path="/plage-horaire" element={<Disponibilités />} />
            <Route path="/type-rendez-vous" element={<Crenaux />} />

            {/* PATIENTS */}
            <Route path="/about" element={<ProfilPatient />} />
            <Route path="/historique/rdv" element={<DashboardPatient />} />
            <Route path="/historique/rdv/:id" element={<HistoriqueRdvCard />} />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
