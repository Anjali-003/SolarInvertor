import {
    BrowserRouter,
    Routes,
    Route,
    Outlet,
} from "react-router-dom";what

// ================= USER PAGES =================

import UploadIMEI from "./pages/UploadIMEI";
import Home from "./pages/Home";
import Fault from "./pages/Fault";
// import Power from "./pages/Power";
import User from "./pages/User";
import Login from "./pages/Login";
import AddDevice from "./pages/AddDevice";
import DeviceDetails from "./pages/DeviceDetails";
import SelectOption from "./pages/SelectOption";
import MyDevices from "./pages/MyDevices";

import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// ================= VENDOR PAGES =================

import VendorLogin from "./pages/VendorLogin";
import DeviceHub from "./pages/DeviceHub";
import RegisterDevice from "./pages/RegisterDevice";
import DeviceCredentials from "./pages/DeviceCredentials";
import VendorDevices from "./pages/VendorDevices";
import VendorProfile from "./pages/VendorProfile";
import VendorDeviceDetails from "./pages/VendorDeviceDetails";

import VendorHome from "./pages/VendorHome";
import VendorPower from "./pages/VendorPower";
import VendorFault from "./pages/VendorFault";

import VendorForgotPassword from "./pages/VendorForgotPassword";
import VendorResetPassword from "./pages/VendorResetPassword";
import VendorVerifyEmail from "./pages/VendorVerifyEmail";

// ================= ADMIN PAGES =================

import AdminLogin from "./pages/AdminLogin";
import AdminProfile from "./pages/AdminProfile";
import AdminHome from "./pages/AdminHome";
import DeviceRegistered from "./pages/DeviceRegistered";

// ================= ADMIN DEVICE PAGES =================
// (copied from the vendor device pages so admins get the
// same device dashboard functionality vendors already have)

import AdminDevices from "./pages/AdminDevices";
import AdminDeviceHome from "./pages/AdminDeviceHome";
import AdminDevicePower from "./pages/AdminDevicePower";
import AdminDeviceFault from "./pages/AdminDeviceFault";
import AdminDeviceDetails from "./pages/AdminDeviceDetails";
import AdminRegisterDevice from "./pages/AdminRegisterDevice";
import AdminDeviceRegistered from "./pages/AdminDeviceRegistered";

// ================= PROTECTED ROUTES =================

import ProtectedRoute from "./components/ProtectedRoute";
import VendorProtectedRoute from "./components/VendorProtectedRoutes";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminLayout from "./components/AdminLayout";

// ================= CONTEXT =================

import { InverterProvider } from "./context/Context";
import { VendorDeviceProvider } from "./context/VendorDeviceContext";
import { AdminDeviceProvider } from "./context/AdminDeviceContext";




function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* =====================================================
                    USER LOGIN
                ===================================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =====================================================
                    SELECT OPTION

                    This is now the landing page shown right after
                    opening the website / logging in (root "/").
                    The dashboard (Home) has moved to "/home" and is
                    reached only after picking an option / via the
                    footer nav — it no longer shows immediately.
                ===================================================== */}

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <SelectOption />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================================
                    VENDOR LOGIN
                ===================================================== */}

                <Route
                    path="/vendor-login"
                    element={<VendorLogin />}
                />


                {/* =====================================================
                    ADMIN LOGIN
                ===================================================== */}

                <Route
                    path="/admin-login"
                    element={<AdminLogin />}
                />


                {/* =====================================================
                    VENDOR DEVICE MANAGEMENT
                ===================================================== */}

                <Route
                    path="/devices"
                    element={
                        <VendorProtectedRoute>
                            <DeviceHub />
                        </VendorProtectedRoute>
                    }
                />

                <Route
                    path="/register-device"
                    element={
                        <VendorProtectedRoute>
                            <RegisterDevice />
                        </VendorProtectedRoute>
                    }
                />

                <Route
                    path="/device-registered"
                    element={
                        <VendorProtectedRoute>
                            <DeviceRegistered />
                        </VendorProtectedRoute>
                    }
                />

                <Route
                    path="/vendor/profile"
                    element={
                        <VendorProtectedRoute>
                            <VendorProfile />
                        </VendorProtectedRoute>
                    }
                />

                <Route
                    path="/my-devices"
                    element={
                    <VendorProtectedRoute>
                        <VendorDevices />
                        </VendorProtectedRoute>}
                />

                 


                {/* =====================================================
                    USER PAGES
                    InverterProvider belongs to the USER side.

                    NOTE: Dashboard (Home) used to live at "/".
                    It now lives at "/home" — "/" shows the
                    SELECT OPTION page instead (see above).
                ===================================================== */}

                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <InverterProvider>
                                <Home />
                            </InverterProvider>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/fault"
                    element={
                        <ProtectedRoute>
                            <InverterProvider>
                                <Fault />
                            </InverterProvider>
                        </ProtectedRoute>
                    }
                />
{/* 
                <Route
                    path="/power"
                    element={
                        <ProtectedRoute>
                            <InverterProvider>
                                <Power />
                            </InverterProvider>
                        </ProtectedRoute>
                    }
                /> */}

                <Route
                    path="/user"
                    element={
                        <ProtectedRoute>
                            <InverterProvider>
                                <User />
                            </InverterProvider>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/add-device"
                    element={
                        <ProtectedRoute>
                            <InverterProvider>
                                <AddDevice />
                            </InverterProvider>
                        </ProtectedRoute>
                    }
                />

                {/* =====================================================
                    SAVED DEVICES LIST (USER SIDE)

                    NOTE: "/my-devices" is already taken by the
                    VENDOR device list above, so this user-facing
                    list lives at "/saved-devices" instead.
                ===================================================== */}

                <Route
                    path="/saved-devices"
                    element={
                        <ProtectedRoute>
                            <InverterProvider>
                                <MyDevices />
                            </InverterProvider>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/device-details"
                    element={<ProtectedRoute>
                        <InverterProvider>
                            <DeviceDetails />
                        </InverterProvider>
                    </ProtectedRoute>
                    }
                />

<Route
    path="/verify-email"
    element={
    <VerifyEmail />}
/>

<Route
    path="/forgot-password"
    element={<ForgotPassword />}
/>

<Route
    path="/reset-password"
    element={<ResetPassword />}
/>

<Route
    path="/vendor/verify-email"
    element={
    <VendorVerifyEmail />}
/>

<Route
  path="/vendor/forgot-password"
  element={<VendorForgotPassword />}
/>

<Route
  path="/vendor/reset-password"
  element={<VendorResetPassword />}
/>
                {/* =====================================================
                    DEVICE CREDENTIALS
                ===================================================== */}

                <Route
                    path="/credentials/:certificateId"
                    element={<DeviceCredentials />}
                />


                {/* =====================================================
                    VENDOR PAGES
                   
                    IMPORTANT:
                    One VendorDeviceProvider is shared by all
                    vendor pages.
                ===================================================== */}

                <Route
                    element={
                        <VendorProtectedRoute>
                            <VendorDeviceProvider>
                                <Outlet />
                            </VendorDeviceProvider>
                        </VendorProtectedRoute>
                    }
                >

                    {/* Vendor Home */}

                    <Route
                        path="/vendor"
                        element={<VendorHome />}
                    />

                    {/* Vendor Power */}

                    <Route
                        path="/vendor/device/:id/power"
                        element={<VendorPower />}
                    />

                    {/* Vendor Fault */}

                    <Route
                        path="/vendor/device/:id/fault"
                        element={<VendorFault />}
                    />

                    <Route
    path="/vendor/device/:id/details" 
                    element={
                        <VendorDeviceDetails />
                        }
                />

                </Route>


                {/* =====================================================
                    ADMIN DEVICE MANAGEMENT

                    Copied from the VENDOR DEVICE MANAGEMENT /
                    VENDOR PAGES sections above. Admin sees the
                    same device dashboard, power, fault, and
                    details pages the vendor sees — just across
                    every vendor's devices instead of just one.
                ===================================================== */}

                <Route
                    path="/admin/devices"
                    element={
                        <AdminProtectedRoute>
                            <AdminDevices />
                        </AdminProtectedRoute>
                    }
                />

                {/* Admin Register Device — mirrors vendor's
                    /register-device, but admin picks the
                    vendor to register the device under. */}
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

                    {/* Admin Device Home / Dashboard */}

                    <Route
                        path="/admin/devices/dashboard"
                        element={<AdminDeviceHome />}
                    />

                    {/* Admin Device Power */}

                    <Route
                        path="/admin/device/:id/power"
                        element={<AdminDevicePower />}
                    />

                    {/* Admin Device Fault */}

                    <Route
                        path="/admin/device/:id/fault"
                        element={<AdminDeviceFault />}
                    />

                    {/* Admin Device Details */}

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