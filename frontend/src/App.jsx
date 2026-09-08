import {
    BrowserRouter,
    Routes,
    Route,
    Outlet,
} from "react-router-dom";

// ================= USER PAGES =================

import UploadIMEI from "./pages/UploadIMEI";
import Home from "./pages/Home";
import Fault from "./pages/Fault";
// import Power from "./pages/Power";
import User from "./pages/User";
import Login from "./pages/Login";
import AddDevice from "./pages/AddDevice";
import DeviceDetails from "./pages/DeviceDetails";

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
import PendingVendors from "./pages/PendingVendors";
import AdminProfile from "./pages/AdminProfile";
import AdminHome from "./pages/AdminHome";
import DeviceRegistered from "./pages/DeviceRegistered";

// ================= PROTECTED ROUTES =================

import ProtectedRoute from "./components/ProtectedRoute";
import VendorProtectedRoute from "./components/VendorProtectedRoutes";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminLayout from "./components/AdminLayout";

// ================= CONTEXT =================

import { InverterProvider } from "./context/Context";
import { VendorDeviceProvider } from "./context/VendorDeviceContext";




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
                ===================================================== */}

                <Route
                    path="/"
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
                        path="/admin/pending"
                        element={<PendingVendors />}
                    />

                    <Route
                        path="/admin/upload-imei"
                        element={<UploadIMEI />}
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <h2>
                                Users (Coming Soon)
                            </h2>
                        }
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