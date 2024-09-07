import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import { getAuth, updatePassword } from "firebase/auth";
import PasswordField from '../../components/common/PasswordField';
import SubmitButton from '../../components/common/SubmitButton';

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
            });
        setPassword('');
        setLoading(false);
    };

    return (
        <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
            <h4 className="text-center mb-4">Update Password</h4>
            <form onSubmit={handleSubmit}>
                <PasswordField password={password} setPassword={setPassword} loading={loading} />
                <SubmitButton loading={loading} disabled={!password || loading} label="Submit" />
            </form>
        </div>
    );
}

export default UpdatePassword;
