import { Outlet, Navigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import ErrorFallback from "../../components/ErrorFallback";
import { URL } from "../urlEndpoints";
import { useAuth } from "../../core/AuthProvider";

const PrivateRoutes = () => {
  const { user, loading } = useAuth();

  return user ? (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Outlet />
    </ErrorBoundary>
  ) : (
    <Navigate to={URL.LOGIN} />
  );
};

export default PrivateRoutes;
