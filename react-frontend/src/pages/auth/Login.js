import React, { useContext, useState } from 'react';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { gql, useMutation } from '@apollo/client';
import { AuthContext } from '../../context/authContext';

// Define mutation
const SAVE_USER_INTO_DB = gql`
  mutation Mutation {
    userCreate {
        username
        email
    }
  }
`;

function Login(props)
{
    const [userCreate, { loading: mloading, error }] = useMutation(SAVE_USER_INTO_DB);
    const provider = new GoogleAuthProvider();

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('bigdelladka@gmail.com');
    const [password, setPassword] = useState('12345678');
    const auth = getAuth();
    const { dispatch } = useContext(AuthContext);
    let history = useNavigate();

    // Conditional return statements for loading and error handling
    if (mloading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);
        try
        {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user.emailVerified)
            {
                const idTokenResult = await user.getIdToken(true);
                // console.log(idTokenResult);
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: {
                        email: user.email,
                        token: idTokenResult,
                    },
                });

                await userCreate();  // Save user info to the database
                history('/update/profile');
            }
            else
            {
                toast.error("Please verify your email before logging in.");
            }
        } catch (error)
        {
            console.error('Login error:', error);
            toast.error(error.message);
        } finally
        {
            setLoading(false);  // Reset loading state when process is done
        }
    };

    const googleLogin = async () =>
    {
        setLoading(true);
        try
        {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idTokenResult = await user.getIdTokenResult();  // Get token using getIdTokenResult()

            dispatch({
                type: 'LOGGED_IN_USER',
                payload: {
                    email: user.email,
                    token: idTokenResult.token,
                },
            });

            await userCreate();  // Save user info to the database
            history('/');
        } catch (error)
        {
            console.error('Google login error:', error);
            toast.error(error.message);
        } finally
        {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100">
            <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h4 className="text-center mb-4">Login</h4>
                <button
                    type="button"
                    onClick={googleLogin}
                    className="btn btn-danger w-100 mb-3"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Google Login'}
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            placeholder="Enter email address"
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            placeholder="Enter your password"
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={!email || loading}
                    >
                        {loading ? 'Loading...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
