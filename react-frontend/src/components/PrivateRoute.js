import { Navigate, Link } from "react-router-dom";
import { AuthContext } from '../context/authContext';
import { useContext, useEffect, useState } from "react";

const PrivateRoute = ({ children }) =>
{
    const { state } = useContext(AuthContext);
    const { user } = state;

    const [countdown, setCountdown] = useState(5); // Set initial countdown to 5 seconds

    useEffect(() =>
    {
        if (!user)
        {
            const timer = setInterval(() =>
            {
                setCountdown((prev) => prev - 1);
            }, 1000); // Decrease countdown every second

            return () => clearInterval(timer); // Cleanup timer on unmount
        }
    }, [user]);

    // If user is authenticated, render the child components
    if (user)
    {
        return (
            <div className="container-fluid pt-5">
                <div className="row">
                    <div className="col-md-4">
                        <nav>
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/update/profile">Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/update/password">Password</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/create/post">Post</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="col-md-8">
                        {children}
                    </div>
                </div>
            </div>
        );
    }

    // If countdown reaches 0, redirect to login
    if (countdown === 0)
    {
        return <Navigate to="/login" />;
    }

    // Display loading message and countdown
    return (
        <div className="container text-center pt-5">
            <p>Redirecting to login in {countdown} seconds...</p>
        </div>
    );
};

export default PrivateRoute;
