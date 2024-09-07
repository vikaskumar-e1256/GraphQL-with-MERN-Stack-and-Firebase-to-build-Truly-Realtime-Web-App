import { Navigate, Link } from "react-router-dom";
import { AuthContext } from '../context/authContext';
import { useContext } from "react";

const PrivateRoute = ({ children }) =>
{
    const { state } = useContext(AuthContext);
    const { user } = state;

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

    // If user is not authenticated, show loading or redirect
    return <Navigate to="/login" />;
};

export default PrivateRoute;
