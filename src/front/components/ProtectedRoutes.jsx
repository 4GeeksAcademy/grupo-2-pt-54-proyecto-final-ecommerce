import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () =>{

    const isAuthenticated = sessionStorage.getItem("access_token");

    console.log(isAuthenticated)

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />

}

export default ProtectedRoutes