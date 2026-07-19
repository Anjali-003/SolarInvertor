// import { useState } from "react";
// import { Outlet, NavLink, useNavigate } from "react-router-dom";
// import "../styles/admin.css";
// import logo from "../assets/logo.png";

// export default function AdminLayout() {

//     const navigate = useNavigate();
//     const [sidebarOpen, setSidebarOpen] = useState(false);

//     function logout() {
//         localStorage.removeItem("adminToken");
//         localStorage.removeItem("adminName");
//         localStorage.removeItem("adminEmail");
//         navigate("/admin-login");
//     }

//     function closeSidebar() {
//         setSidebarOpen(false);
//     }

//     return (
//         <div className="admin-container">

//             <button
//                 className="hamburger"
//                 onClick={() => setSidebarOpen(true)}
//                 aria-label="Open menu"
//             >
//                 <span />
//                 <span />
//                 <span />
//             </button>

//             <div
//                 className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
//                 onClick={closeSidebar}
//             />

//             <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
//                 <div>
//                     <div className="logo-section">
//                         <img src={logo} alt="Logo" />
//                         <h2>Solar Inverter</h2>
//                         <p>ADMIN PANEL</p>
//                     </div>

//                     <div className="sidebar-menu">
//                         <NavLink
//                             to="/admin"
//                             end
//                             className={({ isActive }) =>
//                                 isActive ? "sidebar-link active" : "sidebar-link"
//                             }
//                             onClick={closeSidebar}
//                         >
//                             Pending Vendors
//                         </NavLink>

//                         <NavLink
//                             to="/admin/upload-imei"
//                             className={({ isActive }) =>
//                                 isActive ? "sidebar-link active" : "sidebar-link"
//                             }
//                             onClick={closeSidebar}
//                         >
//                             Upload IMEI
//                         </NavLink>

//                         <NavLink
//                             to="/admin/users"
//                             className={({ isActive }) =>
//                                 isActive ? "sidebar-link active" : "sidebar-link"
//                             }
//                             onClick={closeSidebar}
//                         >
//                             Users
//                         </NavLink>
//                     </div>
//                 </div>

//                 <button className="logout-btn" onClick={logout}>
//                     Logout
//                 </button>
//             </aside>

//             <main className="admin-content">
//                 <Outlet />
//             </main>
//         </div>
//     );
// }

import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "../styles/admin.css";
import logo from "../assets/logo.png";
import P from "../theme/colors";

export default function AdminLayout() {

    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminName");
        localStorage.removeItem("adminEmail");
        navigate("/admin-login");
    }

    return (
        <div className="admin-container">

            {/* SIDEBAR — visible on desktop (>1024px) */}
            <aside className="sidebar">
                <div>
                    <div className="logo-section">
    <div className="logo-box">
        <img src={logo} alt="Logo" />
    </div>
                        <p>Admin Panel</p>
                    </div>

                    <nav className="sidebar-menu">
                        <NavLink
                            to="/admin"
                            end
                            className={({ isActive }) =>
                                isActive ? "sidebar-link active" : "sidebar-link"
                            }
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            Pending Vendors
                        </NavLink>

                        <NavLink
                            to="/admin/upload-imei"
                            className={({ isActive }) =>
                                isActive ? "sidebar-link active" : "sidebar-link"
                            }
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                            Upload IMEI
                        </NavLink>

                        <NavLink
                            to="/admin/users"
                            className={({ isActive }) =>
                                isActive ? "sidebar-link active" : "sidebar-link"
                            }
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>
                            </svg>
                            Users
                        </NavLink>
                    </nav>
                </div>

                <button className="logout-btn" onClick={logout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={P.surface} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="admin-content">
                <Outlet />
            </main>

            {/* BOTTOM NAV — visible on tablet/mobile (<1024px) */}
            <nav className="admin-bottom-nav">
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                        isActive ? "admin-nav-item active" : "admin-nav-item"
                    }
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>Vendors</span>
                </NavLink>

                <NavLink
                    to="/admin/upload-imei"
                    className={({ isActive }) =>
                        isActive ? "admin-nav-item active" : "admin-nav-item"
                    }
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span>Upload IMEI</span>
                </NavLink>

                <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                        isActive ? "admin-nav-item active" : "admin-nav-item"
                    }
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>
                    </svg>
                    <span>Users</span>
                </NavLink>

                <div
                    className="admin-nav-item"
                    onClick={logout}
                    style={{ cursor: "pointer" }}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span>Logout</span>
                </div>
            </nav>

        </div>
    );
}