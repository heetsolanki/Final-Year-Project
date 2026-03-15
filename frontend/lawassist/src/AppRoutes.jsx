import { Routes, Route } from "react-router-dom";

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
import ChatPage from "./pages/ChatPage";
import Consultations from "./pages/Consultations";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Disclaimer from "./pages/Disclaimer";

// Components
import LawDetails from "./components/laws/LawDetails";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const AppRoutes = () => {
  return (
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
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/experts" element={<Experts />} />
      <Route
        path="/expert-profile"
        element={
          <ProtectedRoute allowedRole="legalExpert">
            <ExpertProfile />
          </ProtectedRoute>
        }
      />
      <Route path="/experts/:id" element={<ViewExpert />} />
      <Route path="/explore-rights" element={<ExploreRights />} />
      <Route path="/laws/:id" element={<LawDetails />} />
      <Route path="/explore-rights" element={<ExploreRights />} />
      <Route path="/queries" element={<Queries />} />
      <Route path="/consultations" element={<Consultations />} />
      <Route path="/chat/:consultationId" element={<ChatPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/disclaimer" element={<Disclaimer />} />
    </Routes>
  );
};

export default AppRoutes;
