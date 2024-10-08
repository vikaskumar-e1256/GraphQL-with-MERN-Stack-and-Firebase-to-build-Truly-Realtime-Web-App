import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import EmailField from '../../components/common/EmailField';
import SubmitButton from '../../components/common/SubmitButton';


function ForgotPassword(props)
{
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = (e) =>
    {
        // console.log(auth);
        e.preventDefault();
        // Handle ForgotPassword logic here
        setLoading(true);
        sendPasswordResetEmail(auth, email, {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT,
            // This must be true.
            handleCodeInApp: true,
        })
            .then(() =>
            {
                // The link was successfully sent. Inform the user.
                toast.success(`Email sent to ${email}. Click the link to create new password.`);

            })
            .catch((error) =>
            {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, '::', errorMessage);
                // ...
            });
        setEmail('');
        setLoading(false);
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100">
            <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h4 className="text-center mb-4">Forgot Password</h4>
                <form onSubmit={handleSubmit}>
                    <EmailField email={email} setEmail={setEmail} loading={loading} />
                    <SubmitButton loading={loading} disabled={!email || loading} label="Submit" />
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
