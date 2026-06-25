import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}) {

  const userToken =
    localStorage.getItem("token");

  const vendorToken =
    localStorage.getItem("vendorToken");

  if (!userToken && !vendorToken) {

    return (
      <Navigate to="/login" />
    );
  }

  return children;
}