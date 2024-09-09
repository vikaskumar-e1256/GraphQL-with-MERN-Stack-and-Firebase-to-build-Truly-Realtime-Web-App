import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
import { toast } from "react-toastify";



const Nav = () =>
{
    const { state, dispatch } = useContext(AuthContext);
    const { user } = state;
    console.log(user);
    let history = useNavigate();
    const auth = getAuth();

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
    }
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

                        {/* <li className="nav-item dropdown">
                            <a
                                data-mdb-dropdown-init
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="navbarDropdown"
                                role="button"
                                aria-expanded="false"
                            >
                                Dropdown
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li>
                                    <a className="dropdown-item" href="#">Action</a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">Another action</a>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <a className="dropdown-item" href="#">Something else here</a>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled"
                            >Disabled</a
                            >
                        </li> */}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Nav;
