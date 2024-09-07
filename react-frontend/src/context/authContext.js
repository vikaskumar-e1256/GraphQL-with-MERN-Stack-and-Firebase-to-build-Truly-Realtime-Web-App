import React, { createContext, useEffect, useReducer } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Reducer function to update the state
const firebaseReducer = (state, action) =>
{
    switch (action.type)
    {
        case 'LOGGED_IN_USER':
            return { ...state, user: action.payload };
        default:
            return state;
    }
};

// Initial state
const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null, // Load user from localStorage if available
};

// Create context
const AuthContext = createContext();

// Context provider component
const AuthProvider = ({ children }) =>
{
    const [state, dispatch] = useReducer(firebaseReducer, initialState);

    useEffect(() =>
    {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) =>
        {
            if (user)
            {
                try
                {
                    // Fetch the token and dispatch user information
                    const idTokenResult = await user.getIdTokenResult();

                    const userData = {
                        email: user.email,
                        token: idTokenResult.token,
                    };

                    // Save user data to context
                    dispatch({
                        type: 'LOGGED_IN_USER',
                        payload: userData,
                    });

                    // Optionally, persist user in localStorage
                    localStorage.setItem('user', JSON.stringify(userData));
                } catch (error)
                {
                    console.error("Error fetching token:", error);
                }
            } else
            {
                // Clear user from state and localStorage if logged out
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: null,
                });
                localStorage.removeItem('user');
            }
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

// Export context and provider
export { AuthContext, AuthProvider };
