import { BrowserRouter } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ScrollToTop from "./components/layout/ScrollToTop";
import AppRoutes from "./AppRoutes";
import { NotificationCenterProvider } from "./context/NotificationCenterContext";
import { ConfirmModalProvider } from "./context/ConfirmModalContext";

function App() {
  return (
    <BrowserRouter>
      <ConfirmModalProvider>
        <NotificationCenterProvider>
          <ScrollToTop />
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </NotificationCenterProvider>
      </ConfirmModalProvider>
    </BrowserRouter>
  );
}

export default App;