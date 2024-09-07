import React from 'react';

const SubmitButton = ({ loading, disabled, label }) => (
    <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={disabled}
    >
        {loading ? 'Loading...' : label}
    </button>
);

export default SubmitButton;
