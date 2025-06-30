import React, { useState, useEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import '../styles/dhis2.css';
import API from "../helpers/api";
import { logout } from "../helpers/auth";

const MainLayout = ({ children }) => {
  const [facilities, setFacilities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const location = useLocation();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/');
  };

  const fetchFacilities = async () => {
    try {
      const response = await API.get(`/facility`);
      setFacilities(response.data.facility);
    } catch (error) {
      console.log('Error fetching facilities', 'danger');
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'speedometer2', path: '/' },
    { id: 'hmis', label: 'HMIS Reports', icon: 'file-earmark-text', path: '/hmis' },
    { id: 'hmis', label: 'DHIS2 Mapping', icon: 'map', path: '/mapping' },
    { id: 'opd', label: 'Outpatient', icon: 'person-walking', path: '/outpatient' },
    { id: 'inpatient', label: 'Inpatient', icon: 'hospital', path: '/inpatient' },
    { id: 'laboratory', label: 'Laboratory', icon: 'flask', path: '/lab' },
    { id: 'medicines', label: 'Supply Chain', icon: 'capsule', path: '/supplychain' },
    { id: 'familyplanning', label: 'Family Planning', icon: 'person-hearts', path: '/familyplanning' },
    { id: 'imaging', label: 'Imaging', icon: 'emoji-smile', path: '/imaging' },
    { id: 'theatre', label: 'Theatre', icon: 'exclamation-diamond', path: '/theatre' },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: 'gear',
      children: [
        { id: 'facility', label: 'Facility', icon: 'egg-fried', path: '/facility' },
        { id: 'users', label: 'Users', icon: 'person-circle', path: '/users' }
      ]
    }
  ];

  return (
    <div className="dhis2-layout">
      <aside className="dhis2-sidebar">
        <div className="p-3">
          <h5 className="mb-3">eAFYA Data Platform</h5>

          <div className="mt-4">
            <ul className="nav nav-pills flex-column">
              {menuItems.map(item => (
                <li className="nav-item" key={item.id}>
                  {item.children ? (
                    <div>
                      <button
                        className="nav-link w-100 text-start border-0 bg-transparent"
                        onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                      >
                        <i className={`bi bi-${item.icon} me-2`}></i>
                        {item.label}
                        <i className={`bi bi-chevron-${showSettingsDropdown ? 'up' : 'down'} float-end mt-1`}></i>
                      </button>
                      {showSettingsDropdown && (
                        <ul className="nav nav-pills flex-column ms-3">
                          {item.children.map(child => (
                            <li className="nav-item" key={child.id}>
                              <Link
                                to={child.path}
                                className={`nav-link ${location.pathname === child.path ? 'active' : ''}`}
                              >
                                <i className={`bi bi-${child.icon} me-2`}></i>
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                      <i className={`bi bi-${item.icon} me-2`}></i>
                      {item.label}
                    </Link>
                  )}
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
            {facilities.length > 0 && facilities[0].facility_name}
            <div className="dropdown d-inline-block ms-2">
              <button 
                className="btn btn-link text-white dropdown-toggle" 
                type="button" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <i className="bi bi-gear"></i>
              </button>
              {showDropdown && (
                <div className="dropdown-menu show" style={{ position: 'absolute', right: 0 }}>
                  <button 
                    className="dropdown-item" 
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
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