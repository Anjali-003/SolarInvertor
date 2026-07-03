import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import UploadIMEI from "./pages/UploadIMEI";
import Home from "./pages/Home";
import Fault from "./pages/Fault";
import Power from "./pages/Power";
import User from "./pages/User";
import Login from "./pages/Login";
import VendorLogin from "./pages/VendorLogin";
import DeviceHub from "./pages/DeviceHub";
import RegisterDevice from "./pages/RegisterDevice";
import DeviceCredentials from "./pages/DeviceCredentials";
import VendorDevices from "./pages/VendorDevices";
import ProtectedRoute from "./components/ProtectedRoute";
import VendorProtectedRoute from "./components/VendorProtectedRoutes";
import VendorHome from "./pages/VendorHome";
import VendorPower from "./pages/VendorPower";
import VendorFault from "./pages/VendorFault";
import AdminLogin from "./pages/AdminLogin";
import PendingVendors from "./pages/PendingVendors";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import VendorProfile from "./pages/VendorProfile";
import { InverterProvider } from "./context/Context";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* USER LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* VENDOR LOGIN */}
        <Route
          path="/vendor-login"
          element={<VendorLogin />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* VENDOR ONLY */}
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

        {/* SHARED PAGES (USER + VENDOR) */}

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

        <Route
          path="/power"
          element={
            <ProtectedRoute>
              <InverterProvider>
                <Power />
              </InverterProvider>
            </ProtectedRoute>
          }
        />

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
          path="/credentials/:certificateId"
          element={<DeviceCredentials />}
        />

         <Route
  path="/my-devices"
  element={<VendorDevices />}
/>


<Route
    path="/vendor"
    element={
        <VendorProtectedRoute>
            <VendorHome />
        </VendorProtectedRoute>
    }
/>

<Route
    path="/vendor/device/:id/power"
    element={
        <VendorProtectedRoute>
            <VendorPower />
        </VendorProtectedRoute>
    }
/>

<Route
    path="/vendor/device/:id/fault"
    element={
        <VendorProtectedRoute>
            <VendorFault />
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
  element={
    <AdminProtectedRoute>
      <AdminLayout />
    </AdminProtectedRoute>
  }
>
  <Route
    path="/admin"
    element={<PendingVendors />}
  />

  <Route
    path="/admin/upload-imei"
    element={<UploadIMEI />}
  />

  <Route
    path="/admin/users"
    element={
      <h2>Users (Coming Next)</h2>
    }
  />
</Route>

<Route
  path="*"
  element={
    <div style={{ padding: 40 }}>
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