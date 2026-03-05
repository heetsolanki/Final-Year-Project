import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import UserDashboard from "./pages/UserDashboard";
import UserManageProfile from "./pages/UserManageProfile";
import LegalExpertDashboard from "./pages/LegalExpertDashboard";
import Experts from "./pages/Experts";
import ExpertProfile from "./pages/ExpertProfile";
import ExploreRights from "./pages/ExploreRights";
import Queries from "./pages/Queries";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/user-dashboard" element={<UserDashboard />}>
          <Route path="manage-profile" element={<UserManageProfile />} />
        </Route>
        <Route
          path="/legal-expert-dashboard"
          element={<LegalExpertDashboard />}
        />
        <Route path="/experts" element={<Experts />} />
        <Route path="/expert-profile" element={<ExpertProfile />} />
        <Route path="/explore-rights" element={<ExploreRights />} />
        <Route path="/queries" element={<Queries />} />
      </Routes>
    </Router>
  );
}

export default App;
