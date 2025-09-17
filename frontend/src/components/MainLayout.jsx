"use client";

import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import API from "../helpers/api";
import { logout, getCurrentUser, isAdmin } from "../helpers/auth";
import MainSideBar from "./MainSideBar";

const MainLayout = ({ children }) => {
  const [facilities, setFacilities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push("/");
  };

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/facility`);
      setFacilities(response.data.facility);
    } catch (error) {
      console.log("Error fetching facilities", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchFacilities();
    const user = getCurrentUser();
    setUser(user);
  }, []);

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
      <MainSideBar />

      {/* Main Content Area */}
      <div className="flex-fill d-flex flex-column overflow-hidden">
        {/* Header */}
        <header className=" bg-primary text-white d-flex justify-content-between align-items-center p-2">
          <div className="text-white">
            <i className="bi bi-grid me-2"></i>
            Ministry of Health - eAFYA Data Mining Tool
          </div>
          <div className="d-flex align-items-center gap-3">
          {facilities.length > 0 && facilities[0].facility_name}
        
            <div className="dropdown d-inline-block">
              <button
                className="btn btn-link text-white dropdown-toggle"
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <i className="bi bi-gear"></i>
              </button>
              {showDropdown && (
                <div
                  className="dropdown-menu show"
                  style={{ position: "absolute", right: 0 }}
                >
                  {/* {user && (
                <>
                  {user.firstname} {user.lastname}
                    {user.role === "admin" ? "Admin" : "User"}
                </>
              )} */}
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-fill overflow-auto backgroundLogo">
          <div className="container flex-fill py-3">
            <div className="flex-fill">{children}</div>
          </div>
        </main>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 d-flex align-items-center justify-content-center"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white rounded-3 p-4 shadow">
            <div className="d-flex align-items-center">
              <div className="spinner-border text-primary me-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div>
                <div className="fw-medium">Loading facilities...</div>
                <small className="text-muted">Please wait</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;

// import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
// import API from "../helpers/api";
// import { logout } from "../helpers/auth";
// import MainSideBar from "./MainSideBar";

// const MainLayout = ({ children }) => {
//   const [facilities, setFacilities] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);

//   const history = useHistory();

//   const handleLogout = () => {
//     logout();
//     history.push("/");
//   };

//   const fetchFacilities = async () => {
//     try {
//       const response = await API.get(`/facility`);
//       setFacilities(response.data.facility);
//     } catch (error) {
//       console.log("Error fetching facilities", "danger");
//     }
//   };

//   useEffect(() => {
//     fetchFacilities();
//   }, []);

//   return (
//     <div className="dhis2-layou bg-light border d-flex">
//       <MainSideBar />

//       <div className="flex-fill">
// <header className=" bg-primary text-white d-flex justify-content-between align-items-center p-2">
//   <div className="text-white">
//     <i className="bi bi-grid me-2"></i>
//     Ministry of Health
//   </div>
//   <div>
//     <i className="bi bi-person-circle me-2"></i>
//     {facilities.length > 0 && facilities[0].facility_name}
//     <div className="dropdown d-inline-block ms-2">
//       <button
//         className="btn btn-link text-white dropdown-toggle"
//         type="button"
//         onClick={() => setShowDropdown(!showDropdown)}
//       >
//         <i className="bi bi-gear"></i>
//       </button>
//       {showDropdown && (
//         <div
//           className="dropdown-menu show"
//           style={{ position: "absolute", right: 0 }}
//         >
//           <button className="dropdown-item" onClick={handleLogout}>
//             <i className="bi bi-box-arrow-right me-2"></i>
//             Logout
//           </button>
//         </div>
//       )}
//     </div>
//   </div>
// </header>

//         <main className="dhis2-main-conten p-4 ">{children}</main>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;
