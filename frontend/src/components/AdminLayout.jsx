import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "../styles/admin.css";

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

            {/* Sidebar */}

            <aside className="sidebar">

                <div>

                    <div className="logo-section">

                        <img
                            src="/src/assets/logo.png"
                            alt="Logo"
                        />

                        <h2>
                            Solar Inverter
                        </h2>

                        <p>
                            ADMIN PANEL
                        </p>

                    </div>

                    <div className="sidebar-menu">

                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar-link active"
                                    : "sidebar-link"
                            }
                        >
                            📋 Pending Vendors
                        </NavLink>

                        <NavLink
                            to="/admin/upload-imei"
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar-link active"
                                    : "sidebar-link"
                            }
                        >
                            📤 Upload IMEI
                        </NavLink>

                        <NavLink
                            to="/admin/users"
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar-link active"
                                    : "sidebar-link"
                            }
                        >
                            👥 Users
                        </NavLink>

                    </div>

                </div>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    🚪 Logout
                </button>

            </aside>

            {/* Main */}

            <main className="admin-content">

                <Outlet />

            </main>

        </div>

    );

}