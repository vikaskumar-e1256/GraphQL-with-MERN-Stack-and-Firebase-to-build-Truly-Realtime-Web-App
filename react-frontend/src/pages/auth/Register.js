import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import EmailField from '../../components/common/EmailField';
import SubmitButton from '../../components/common/SubmitButton';

function Register(props)
{
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = (e) =>
    {
        // console.log(auth);
        e.preventDefault();
        // Handle register logic here
        setLoading(true);
        sendSignInLinkToEmail(auth, email, {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
            // This must be true.
            handleCodeInApp: true,
        })
            .then(() =>
            {
                // The link was successfully sent. Inform the user.
                toast.success(`Email sent to ${email}. Click the link to complete your registration.`);
                // Save the email locally so you don't need to ask the user for it again
                // if they open the link on the same device.
                window.localStorage.setItem('emailForSignIn', email);
                // ...
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
                <h4 className="text-center mb-4">Register</h4>
                <form onSubmit={handleSubmit}>
                    <EmailField email={email} setEmail={setEmail} loading={loading} />
                    <SubmitButton loading={loading} disabled={!email || loading} label="Submit" />
                </form>
            </div>
        </div>
    );
}

export default Register;
