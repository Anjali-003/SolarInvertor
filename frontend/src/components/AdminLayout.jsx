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