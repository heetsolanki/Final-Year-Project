import { BrowserRouter } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ScrollToTop from "./components/layout/ScrollToTop";
import AppRoutes from "./AppRoutes";
import { NotificationCenterProvider } from "./context/NotificationCenterContext";

function App() {
  return (
    <BrowserRouter>
      <NotificationCenterProvider>
        <ScrollToTop />
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </NotificationCenterProvider>
    </BrowserRouter>
  );
}

export default App;