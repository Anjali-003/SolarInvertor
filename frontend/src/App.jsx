import {
    BrowserRouter,
    Routes,
    Route,
    Outlet,
} from "react-router-dom";

// ================= USER PAGES =================
// No accounts/login anymore. "My devices" is whatever is
// saved on this phone (see utils/deviceMeta.js) — every
// page below is reachable directly.

import UploadIMEI from "./pages/UploadIMEI";
import Home from "./pages/Home";
import Fault from "./pages/Fault";
import AddDevice from "./pages/AddDevice";
import DeviceDetails from "./pages/DeviceDetails";
import SelectOption from "./pages/SelectOption";
import MyDevices from "./pages/MyDevices";

// ================= ADMIN PAGES =================

import AdminLogin from "./pages/AdminLogin";
import AdminProfile from "./pages/AdminProfile";
import AdminHome from "./pages/AdminHome";

// ================= ADMIN DEVICE PAGES =================

import AdminDevices from "./pages/AdminDevices";
import AdminDeviceHome from "./pages/AdminDeviceHome";
import AdminDevicePower from "./pages/AdminDevicePower";
import AdminDeviceFault from "./pages/AdminDeviceFault";
import AdminDeviceDetails from "./pages/AdminDeviceDetails";
import AdminRegisterDevice from "./pages/AdminRegisterDevice";
import AdminDeviceRegistered from "./pages/AdminDeviceRegistered";

// ================= ADMIN PROTECTED ROUTES =================

import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminLayout from "./components/AdminLayout";

// ================= CONTEXT =================

import { InverterProvider } from "./context/Context";
import { AdminDeviceProvider } from "./context/AdminDeviceContext";


function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* =====================================================
                    LANDING PAGE

                    No login — this is the entry screen. From here the
                    user either adds a device by IMEI or opens the
                    devices already saved on this phone.
                ===================================================== */}

                <Route
                    path="/"
                    element={<SelectOption />}
                />


                {/* =====================================================
                    ADMIN LOGIN
                ===================================================== */}

                <Route
                    path="/admin-login"
                    element={<AdminLogin />}
                />


                {/* =====================================================
                    USER PAGES

                    InverterProvider reads "my devices" from this
                    phone's localStorage (see utils/deviceMeta.js) and
                    does public, read-only lookups by IMEI — no login.
                ===================================================== */}

                <Route
                    path="/home"
                    element={
                        <InverterProvider>
                            <Home />
                        </InverterProvider>
                    }
                />

                <Route
                    path="/fault"
                    element={
                        <InverterProvider>
                            <Fault />
                        </InverterProvider>
                    }
                />

                <Route
                    path="/add-device"
                    element={
                        <InverterProvider>
                            <AddDevice />
                        </InverterProvider>
                    }
                />

                {/* =====================================================
                    SAVED DEVICES LIST

                    Everything saved on this phone (deviceMeta.js).
                ===================================================== */}

                <Route
                    path="/saved-devices"
                    element={
                        <InverterProvider>
                            <MyDevices />
                        </InverterProvider>
                    }
                />

                <Route
                    path="/device-details"
                    element={
                        <InverterProvider>
                            <DeviceDetails />
                        </InverterProvider>
                    }
                />


                {/* =====================================================
                    ADMIN DEVICE MANAGEMENT
                ===================================================== */}

                <Route
                    path="/admin/devices"
                    element={
                        <AdminProtectedRoute>
                            <AdminDevices />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/register-device"
                    element={
                        <AdminProtectedRoute>
                            <AdminRegisterDevice />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/device-registered"
                    element={
                        <AdminProtectedRoute>
                            <AdminDeviceRegistered />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    element={
                        <AdminProtectedRoute>
                            <AdminDeviceProvider>
                                <Outlet />
                            </AdminDeviceProvider>
                        </AdminProtectedRoute>
                    }
                >

                    <Route
                        path="/admin/devices/dashboard"
                        element={<AdminDeviceHome />}
                    />

                    <Route
                        path="/admin/device/:id/power"
                        element={<AdminDevicePower />}
                    />

                    <Route
                        path="/admin/device/:id/fault"
                        element={<AdminDeviceFault />}
                    />

                    <Route
                        path="/admin/device/:id/details"
                        element={<AdminDeviceDetails />}
                    />

                </Route>


                {/* =====================================================
                    ADMIN PAGES
                ===================================================== */}

                <Route
                    element={
                        <AdminProtectedRoute>
                            <AdminLayout />
                        </AdminProtectedRoute>
                    }
                >

                    <Route
                        path="/admin"
                        element={<AdminHome />}
                    />

                    <Route
                        path="/admin/upload-imei"
                        element={<UploadIMEI />}
                    />

                    <Route
                        path="/admin/profile"
                        element={<AdminProfile />}
                    />

                </Route>


                {/* =====================================================
                    404
                ===================================================== */}

                <Route
                    path="*"
                    element={
                        <div
                            style={{
                                padding: 40,
                            }}
                        >
                            Route Not Found

                            <br />

                            Current URL:
                            {window.location.pathname}
                        </div>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}


export default App;
