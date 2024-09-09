import { Navigate } from "react-router-dom";
import { AuthContext } from '../context/authContext';
import { useContext } from "react";

const PublicRoute = ({ children }) =>
{
    const { state } = useContext(AuthContext);
    const { user } = state;

    // If user is authenticated, redirect to the profile page
    if (user)
    {
        return <Navigate to="/update/profile" />;
    }

    // If user is unauthenticated, render the child components (like login or register page)
    return children;
};

export default PublicRoute;
