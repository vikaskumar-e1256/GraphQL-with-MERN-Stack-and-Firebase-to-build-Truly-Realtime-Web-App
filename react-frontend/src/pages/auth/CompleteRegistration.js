import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import { updatePassword, signInWithEmailLink } from "firebase/auth";
import { AuthContext } from "../../context/authContext";


function CompleteRegistration(props)
{
    const { dispatch } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    let history = useNavigate();

    useEffect(() =>
    {
        setEmail(localStorage.getItem('emailForSignIn'))
    }, [history]);

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);

        try
        {
            if (!email || !password)
            {
                toast.error('Email and Password fields are required!');
                setLoading(false);
                return;
            }

            const userCredential = await signInWithEmailLink(auth, email, window.location.href);
            const user = userCredential.user;

            if (user.emailVerified)
            {
                localStorage.removeItem('emailForSignIn');
                await updatePassword(user, password);

                // Fetch the token and dispatch user information
                const idTokenResult = await user.getIdTokenResult();

                // Dispatch user data to your AuthContext
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: {
                        email: user.email,
                        token: idTokenResult.token,
                    },
                });

                // make api request to save user info in mongodb

                // Redirect after successful login
                history('/');
            }
        } catch (error)
        {
            console.error('Error during sign-in:', error);
            toast.error(error.message);
        } finally
        {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100">
            <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h4 className="text-center mb-4">Complete Registration</h4>
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
                            disabled
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

export default CompleteRegistration;
