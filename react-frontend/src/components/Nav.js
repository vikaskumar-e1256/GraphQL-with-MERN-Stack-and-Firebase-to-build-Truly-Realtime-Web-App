import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext } from "../context/authContext";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

const Nav = () =>
{
    const { state, dispatch } = useContext(AuthContext);
    const { user } = state;
    let history = useNavigate();
    const auth = getAuth();

    const [searchTerm, setSearchTerm] = useState("");

    const logout = () =>
    {
        signOut(auth).then(() =>
        {
            history('/login');
            dispatch({
                type: 'LOGGED_IN_USER',
                payload: null
            });
        }).catch((error) =>
        {
            toast.error(error.message);
        });
    };

    const handleSearch = (e) =>
    {
        e.preventDefault();
        history(`/search?s=${searchTerm}`);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
            <div className="container-fluid">
                <button
                    data-mdb-collapse-init
                    className="navbar-toggler"
                    type="button"
                    data-mdb-target="#navbarLeftAlignExample"
                    aria-controls="navbarLeftAlignExample"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <i className="fas fa-bars"></i>
                </button>

                <div className="collapse navbar-collapse" id="navbarLeftAlignExample">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" aria-current="page" to="/users">Users</NavLink>
                        </li>

                        {user && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/update/profile">Profile</NavLink>
                            </li>
                        )}

                        {!user && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login">Login</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/register">Register</NavLink>
                                </li>
                            </>
                        )}

                        {user && (
                            <li className="nav-item">
                                <a style={{ 'cursor': 'pointer' }} className="nav-link" onClick={() => logout()}>Logout</a>
                            </li>
                        )}
                    </ul>

                    {/* Search Box and Button */}
                    <form className="d-flex" onSubmit={handleSearch}>
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav>
    );
}

export default Nav;
