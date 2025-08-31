"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function MainSideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "speedometer2",
      path: "/dashboard",
    },
    {
      id: "hmis",
      label: "HMIS Reports",
      icon: "file-earmark-text",
      path: "/hmis",
    },
    { id: "mapping", label: "DHIS2 Mapping", icon: "map", path: "/mapping" },
    {
      id: "opd",
      label: "Outpatient",
      icon: "person-walking",
      path: "/outpatient",
    },
    {
      id: "inpatient",
      label: "Inpatient",
      icon: "hospital",
      path: "/inpatient",
    },
    { id: "laboratory", label: "Laboratory", icon: "flask", path: "/lab" },
    {
      id: "medicines",
      label: "Supply Chain",
      icon: "capsule",
      path: "/supplychain",
    },
    {
      id: "familyplanning",
      label: "Family Planning",
      icon: "person-hearts",
      path: "/familyplanning",
    },
    { id: "imaging", label: "Imaging", icon: "camera", path: "/imaging" },
    {
      id: "theatre",
      label: "Theatre",
      icon: "hospital",
      path: "/theatre",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "gear",
      children: [
        {
          id: "facility",
          label: "Facility",
          icon: "building",
          path: "/facility",
        },
        { id: "users", label: "Users", icon: "person-circle", path: "/users" },
        { id: "reportmapping", label: "Report Mapping", icon: "person-circle", path: "/mappingtest" },
      ],
    },
  ];

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setShowSettingsDropdown(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`d-flex flex-column  border-end shadow-sm  vh-100 overflow-hidden ${
          isCollapsed ? "" : "d-none d-lg-flex"
        }`}
        style={{
          width: isCollapsed ? "45px" : "180px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 1040,
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-2 border-bottom">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              {!isCollapsed && (
                <div className="ms-3">
                  <h6 className="mb-0 fw-bold">eAFYA</h6>
                  <small className="opacity-75">Data Mining Tool</small>
                </div>
              )}
            </div>
            <button
              className="btn btn-sm  p-1 border-0 bg-transparent"
              // onClick={toggleSidebar}
              style={{ fontSize: "1.2rem" }}
            >
              <i
                className={`bi bi-chevron-${isCollapsed ? "right" : "left"}`}
              ></i>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow-1 px-1 py-2 overflow-auto">
          <ul className="nav flex-column gap-1">
            {menuItems.map((item) => (
              <li className="nav-item" key={item.id}>
                {item.children ? (
                  <div>
                    <button
                      className={`nav-link w-100 text-start border-0 bg-transparent d-flex align-items-center justify-content-between p-2 rounded-3  ${
                        showSettingsDropdown ? "text-primary" : "text-muted"
                      }`}
                      onClick={() => {
                        if (!isCollapsed) {
                          setShowSettingsDropdown(!showSettingsDropdown);
                        }
                      }}
                      title={isCollapsed ? item.label : ""}
                      style={{ transition: "all 0.2s ease" }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="text-center">
                          <i className={`bi bi-${item.icon} `}></i>
                        </div>
                        {!isCollapsed && (
                          <span className="ms-3 fw-medium">{item.label}</span>
                        )}
                      </div>
                      {!isCollapsed && (
                        <i
                          className={`bi bi-chevron-${
                            showSettingsDropdown ? "up" : "down"
                          } small`}
                        ></i>
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`collapse ${
                        showSettingsDropdown && !isCollapsed ? "show" : ""
                      }`}
                    >
                      <ul className="nav flex-column ms-4 mt-1">
                        {item.children.map((child) => (
                          <li className="nav-item" key={child.id}>
                            <Link
                              to={child.path}
                              className={`nav-link  rounded-3 d-flex align-items-center ${
                                location.pathname === child.path
                                  ? "active bg-primary bg-opacity-10 text-primary"
                                  : "text-muted hover-bg-light"
                              }`}
                              style={{ transition: "all 0.2s ease" }}
                            >
                              <div
                                className="text-center"
                                style={{ width: "20px" }}
                              >
                                <i className={`bi bi-${child.icon} small`}></i>
                              </div>
                              <span className="ms-2">{child.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`nav-link d-flex align-items-center p-2 rounded-3 ${
                      location.pathname === item.path
                        ? "active bg-primary bg-opacity-10 text-primary "
                        : "text-muted"
                    }`}
                    title={isCollapsed ? item.label : ""}
                    style={{ transition: "all 0.2s ease" }}
                  >
                    <div className="text-center">
                      <i className={`bi bi-${item.icon} `}></i>
                    </div>
                    {!isCollapsed && (
                      <span className="ms-3 fw-medium">{item.label}</span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 p-3 border-top bg-light">
          {!isCollapsed ? (
            <div className="text-center">
              <small className="text-muted">© HMIS Version</small>
              <br />
              <small className="text-muted">Print July 2024</small>
            </div>
          ) : (
            <div className="text-center">
              <i
                className="bi bi-info-circle text-muted"
                title="eAFYA System v2.1.0"
              ></i>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      {/* <div
        className={`offcanvas offcanvas-start ${
          !isCollapsed ? "show" : ""
        } d-lg-none`}
        style={{ visibility: !isCollapsed ? "visible" : "hidden" }}
      >
        <div className="offcanvas-header bg-primary text-white">
          <div className="d-flex align-items-center">
            <div
              className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{ width: "40px", height: "40px" }}
            >
              <i className="bi bi-hospital fw-bold"></i>
            </div>
            <div>
              <h5 className="mb-0">eAFYA</h5>
              <small className="opacity-75">Data Mining Tool</small>
            </div>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={toggleSidebar}
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          <nav className="p-3">
            <ul className="nav flex-column gap-1">
              {menuItems.map((item) => (
                <li className="nav-item" key={item.id}>
                  {item.children ? (
                    <div>
                      <button
                        className={`nav-link w-100 text-start border-0 bg-transparent d-flex align-items-center justify-content-between py-3 px-3 rounded-3 text-dark ${
                          showSettingsDropdown ? "bg-light" : ""
                        }`}
                        onClick={() =>
                          setShowSettingsDropdown(!showSettingsDropdown)
                        }
                      >
                        <div className="d-flex align-items-center">
                          <i className={`bi bi-${item.icon} fs-5 me-3`}></i>
                          <span className="fw-medium">{item.label}</span>
                        </div>
                        <i
                          className={`bi bi-chevron-${
                            showSettingsDropdown ? "up" : "down"
                          } small`}
                        ></i>
                      </button>
                      <div
                        className={`collapse ${
                          showSettingsDropdown ? "show" : ""
                        }`}
                      >
                        <ul className="nav flex-column ms-4 mt-1">
                          {item.children.map((child) => (
                            <li className="nav-item" key={child.id}>
                              <Link
                                to={child.path}
                                className={`nav-link py-2 px-3 rounded-3 ${
                                  location.pathname === child.path
                                    ? "active bg-primary text-white"
                                    : "text-muted"
                                }`}
                                onClick={toggleSidebar}
                              >
                                <i className={`bi bi-${child.icon} me-2`}></i>
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`nav-link d-flex align-items-center py-3 px-3 rounded-3 ${
                        location.pathname === item.path
                          ? "active bg-primary text-white"
                          : "text-dark"
                      }`}
                      onClick={toggleSidebar}
                    >
                      <i className={`bi bi-${item.icon} fs-5 me-3`}></i>
                      <span className="fw-medium">{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div> */}

      {/* Mobile Toggle Button */}
      <button
        className="btn btn-primary position-fixed d-lg-none"
        style={{ top: "20px", left: "20px", zIndex: 1050 }}
        onClick={toggleSidebar}
      >
        <i className="bi bi-list"></i>
      </button>

      {/* Backdrop */}
      {!isCollapsed && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 1030 }}
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}

export default MainSideBar;

// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";

// function MainSideBar() {
//   const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
//   const location = useLocation();
//   const menuItems = [
//     {
//       id: "dashboard",
//       label: "Dashboard",
//       icon: "speedometer2",
//       path: "/dashboard",
//     },
//     {
//       id: "hmis",
//       label: "HMIS Reports",
//       icon: "file-earmark-text",
//       path: "/hmis",
//     },
//     { id: "hmis", label: "DHIS2 Mapping", icon: "map", path: "/mapping" },
//     {
//       id: "opd",
//       label: "Outpatient",
//       icon: "person-walking",
//       path: "/outpatient",
//     },
//     {
//       id: "inpatient",
//       label: "Inpatient",
//       icon: "hospital",
//       path: "/inpatient",
//     },
//     { id: "laboratory", label: "Laboratory", icon: "flask", path: "/lab" },
//     {
//       id: "medicines",
//       label: "Supply Chain",
//       icon: "capsule",
//       path: "/supplychain",
//     },
//     {
//       id: "familyplanning",
//       label: "Family Planning",
//       icon: "person-hearts",
//       path: "/familyplanning",
//     },
//     { id: "imaging", label: "Imaging", icon: "emoji-smile", path: "/imaging" },
//     {
//       id: "theatre",
//       label: "Theatre",
//       icon: "exclamation-diamond",
//       path: "/theatre",
//     },
//     {
//       id: "settings",
//       label: "Settings",
//       icon: "gear",
//       children: [
//         {
//           id: "facility",
//           label: "Facility",
//           icon: "egg-fried",
//           path: "/facility",
//         },
//         { id: "users", label: "Users", icon: "person-circle", path: "/users" },
//       ],
//     },
//   ];
//   return (
//     <>
//       <aside className="dhis2-sideba border-end shadow " style={{minWidth: "180px"}}>
//         <div className="p-1">
//           <h5 className="mb-3">eAFYA Data Mining Tool</h5>

//           <div className="mt-4">
//             <ul className="nav nav-pills flex-column">
//               {menuItems.map((item) => (
//                 <li className="nav-item" key={item.id}>
//                   {item.children ? (
//                     <div>
//                       <button
//                         className="nav-link w-100 text-start border-0 bg-transparent"
//                         onClick={() =>
//                           setShowSettingsDropdown(!showSettingsDropdown)
//                         }
//                       >
//                         <i className={`bi bi-${item.icon} me-2`}></i>
//                         {item.label}
//                         <i
//                           className={`bi bi-chevron-${
//                             showSettingsDropdown ? "up" : "down"
//                           } float-end mt-1`}
//                         ></i>
//                       </button>
//                       {showSettingsDropdown && (
//                         <ul className="nav nav-pills flex-column ms-3">
//                           {item.children.map((child) => (
//                             <li className="nav-item" key={child.id}>
//                               <Link
//                                 to={child.path}
//                                 className={`nav-link ${
//                                   location.pathname === child.path
//                                     ? "active"
//                                     : ""
//                                 }`}
//                               >
//                                 <i className={`bi bi-${child.icon} me-2`}></i>
//                                 {child.label}
//                               </Link>
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                     </div>
//                   ) : (
//                     <Link
//                       to={item.path}
//                       className={`nav-link ${
//                         location.pathname === item.path ? "active" : ""
//                       }`}
//                     >
//                       <i className={`bi bi-${item.icon} me-2`}></i>
//                       {item.label}
//                     </Link>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }

// export default MainSideBar;
