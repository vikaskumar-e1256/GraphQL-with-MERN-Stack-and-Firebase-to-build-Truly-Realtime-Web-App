import React from 'react';

const PasswordField = ({ password, setPassword, loading }) => (
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
);

export default PasswordField;
