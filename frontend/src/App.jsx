// import InverterDashboard from "./components/Dashboard";

// function App() {
//   return <InverterDashboard />;
// }

// export default App;


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import InverterDashboard from "./components/Dashboard";
// import PowerPage from "./components/PowerPage";
// import FaultPage from "./components/FaultPage";

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<InverterDashboard />} />
//         <Route path="/power" element={<PowerPage />} />
//         <Route path="/faults" element={<FaultPage />} />
//       </Routes>
//     </Router>
//   );
// }












// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { InverterProvider } from "./context/Context";

// import InverterDashboard from "./components/Dashboard";
// import PowerPage from "./components/Power";
// import FaultPage from "./components/Fault";

// export default function App() {
//   return (
//     <InverterProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<InverterDashboard />} />
//           <Route path="/power" element={<PowerPage />} />
//           <Route path="/faults" element={<FaultPage />} />
//         </Routes>
//       </Router>
//     </InverterProvider>
//   );
// }



import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./components/Dashboard";
import FaultPage from "./components/Fault";
import PowerPage from "./components/Power";

import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";

import { InverterProvider } from "./context/Context";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <InverterProvider>
                <Dashboard />
              </InverterProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/faults"
          element={
            <ProtectedRoute>
              <InverterProvider>
                <FaultPage />
              </InverterProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/power"
          element={
            <ProtectedRoute>
              <InverterProvider>
                <PowerPage />
              </InverterProvider>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}