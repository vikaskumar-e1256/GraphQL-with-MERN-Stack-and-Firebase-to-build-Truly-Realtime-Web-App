import React from 'react';

const EmailField = ({ email, setEmail, loading }) => (
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
);

export default EmailField;
