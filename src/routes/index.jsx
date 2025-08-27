import { Routes, Route, Navigate } from "react-router-dom";

import { URL } from "./urlEndpoints";
import PrivateRoutes from "./Private/Private";
import PublicRoutes from "./Public/Public";
import LoginPage from "../pages/auth/loginPage";
import SignUpPage from "../pages/auth/signUpPage";
import HomePage from "../pages/home/homePage";
import CircularLoader from "../components/circularLoader";
import { useAuth } from "../core/AuthProvider";

const MainRouter = () => {
  const { user, loading } = useAuth();

  return loading ? (
    <CircularLoader height />
  ) : (
    <Routes>
      <Route path={URL.INDEX} element={<PrivateRoutes />}>
        <Route path={URL.INDEX} element={<HomePage />} />
      </Route>
      <Route path={URL.INDEX} element={<PublicRoutes />}>
        <Route path={URL.LOGIN} element={<LoginPage />} />
        <Route path={URL.SIGNUP} element={<SignUpPage />} />
      </Route>
      <Route path={"*"} element={<Navigate to={URL.INDEX} replace />} />
    </Routes>
  );
};

export default MainRouter;
