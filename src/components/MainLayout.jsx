import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/dhis2.css';

const MainLayout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'speedometer2', path: '/' },
    { id: 'hmis', label: 'HMIS Reports', icon: 'file-earmark-text', path: '/hmis' },
    { id: 'opd', label: 'Outpatient', icon: 'person-walking', path: '/outpatient' },
    { id: 'inpatient', label: 'Inpatient', icon: 'hospital', path: '/inpatient' },
    { id: 'laboratory', label: 'Laboratory Tests', icon: 'flask', path: '/lab' },
    { id: 'medicines', label: 'Supplychain', icon: 'capsule', path: '/supplychain' },
    { id: 'maternity', label: 'Maternity', icon: 'person-hearts', path: '/maternity' },
    { id: 'pediatrics', label: 'Pediatrics', icon: 'emoji-smile', path: '/pediatrics' },
    { id: 'emergency', label: 'Emergency', icon: 'exclamation-diamond', path: '/emergency' },
    { id: 'pharmacy', label: 'Pharmacy', icon: 'prescription2', path: '/pharmacy' },
    { id: 'nutrition', label: 'Nutrition', icon: 'egg-fried', path: '/nutrition' }
  ];

  return (
    <div className="dhis2-layout">
      <aside className="dhis2-sidebar">
        <div className="p-3">
          <h5 className="mb-3">eAFYA Data Tool</h5>
          
          <div className="mt-4">
            <ul className="nav nav-pills flex-column">
              {menuItems.map(item => (
                <li className="nav-item" key={item.id}>
                  <Link 
                    to={item.path}
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <i className={`bi bi-${item.icon} me-2`}></i>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </aside>

      <div className="flex-grow-1">
        <header className="dhis2-topbar d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-grid me-2"></i>
            Ministry of Health
          </div>
          <div>
            <i className="bi bi-person-circle me-2"></i>
            Naguru National Referral Hospital
          </div>
        </header>

        <main className="dhis2-main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 