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


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { InverterProvider } from "./context/Context";

import InverterDashboard from "./components/Dashboard";
import PowerPage from "./components/Power";
import FaultPage from "./components/Fault";

export default function App() {
  return (
    <InverterProvider>
      <Router>
        <Routes>
          <Route path="/" element={<InverterDashboard />} />
          <Route path="/power" element={<PowerPage />} />
          <Route path="/faults" element={<FaultPage />} />
        </Routes>
      </Router>
    </InverterProvider>
  );
}