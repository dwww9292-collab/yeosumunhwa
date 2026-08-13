import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { AuthProvider } from "./features/auth/AuthProvider";
import SessionTimeoutGuard from "./features/auth/SessionTimeoutGuard";
import RouteAnnouncer from "./features/seo/RouteAnnouncer";
import SkipToContent from "./components/base/SkipToContent";


function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <BrowserRouter basename={__BASE_PATH__}>
          <SkipToContent />
          <RouteAnnouncer />
          <SessionTimeoutGuard />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;
