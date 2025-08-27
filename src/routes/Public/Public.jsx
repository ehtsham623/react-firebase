import { Outlet, Navigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import ErrorFallback from "../../components/ErrorFallback";
import { URL } from "../urlEndpoints";

import { useAuth } from "../../core/AuthProvider";

const PublicRoutes = () => {
  const { user, loading } = useAuth();

  return user ? (
    <Navigate to={URL.INDEX} />
  ) : (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Outlet />
    </ErrorBoundary>
  );
};

export default PublicRoutes;
