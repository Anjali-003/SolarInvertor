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

import { Outlet } from "react-router-dom";
import "../styles/admin.css";

export default function AdminLayout() {

    return (
        <div className="admin-container">

            {/* MAIN CONTENT */}
            <main className="admin-content">
                <Outlet />
            </main>

        </div>
    );
}