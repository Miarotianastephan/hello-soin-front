// src/pages/Praticien/DashboardPraticien.jsx
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import SchedulePraticien from '../../components/SchedulePraticien';

function DashboardPraticien() {
  return (
    <div className="dashboard-container">
      {/* <Header /> */}
      <div className="dashboard-content">
        {/* <Sidebar /> */}
        <main>
          <h1>Tableau de bord Praticien</h1>
          <SchedulePraticien />
          <div>Hello world</div>
        </main>
      </div>
    </div>
  );
}

export default DashboardPraticien;