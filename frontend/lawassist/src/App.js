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
import ViewExpert from "./pages/ViewExpert";
import ExploreRights from "./pages/ExploreRights";
import Queries from "./pages/Queries";
import LawDetails from "./components/LawDetails";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Consultations from "./pages/Consultations";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRole="consumer">
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="manage-profile" element={<UserManageProfile />} />
        </Route>
        <Route
          path="/legal-expert-dashboard"
          element={
            <ProtectedRoute allowedRole="legalExpert">
              <LegalExpertDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/experts" element={<Experts />} />
        <Route path="/expert-profile" element={<ExpertProfile />} />
        <Route path="/experts/:id" element={<ViewExpert />} />
        <Route path="/explore-rights" element={<ExploreRights />} />
        <Route path="/laws/:id" element={<LawDetails />} />
        <Route path="/explore-rights" element={<ExploreRights />} />
        <Route path="/queries" element={<Queries />} />
        <Route path="/consultations" element={<Consultations />} />
        <Route path="/chat/:consultationId" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
