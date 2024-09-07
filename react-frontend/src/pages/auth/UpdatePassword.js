import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import { getAuth, updatePassword } from "firebase/auth";


function UpdatePassword(props)
{
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const auth = getAuth();

    const user = auth.currentUser;

    const handleSubmit = (e) =>
    {
        // console.log(auth);
        e.preventDefault();
        // Handle UpdatePassword logic here
        setLoading(true);
        updatePassword(user, password)
            .then(() =>
            {
                toast.success(`Password successfully updated.`);
            })
            .catch((error) =>
            {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, '::', errorMessage);
                // ...
            });
        setPassword('');
        setLoading(false);
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100">
            <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h4 className="text-center mb-4">Update Password</h4>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            placeholder="Enter password"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={!password || loading}
                    >
                        {loading ? 'Loading...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UpdatePassword;
