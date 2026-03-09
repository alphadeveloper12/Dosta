import { Navigate, Outlet } from "react-router-dom";

const AuthMiddleware = () => {
 const authToken =
  sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

 // If no token → redirect to sign in
 if (!authToken) {
  return <Navigate to="/signin" replace />;
 }

 // Token exists → allow visiting protected routes
 return <Outlet />;
};

export default AuthMiddleware;
