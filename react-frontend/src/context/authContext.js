import React, { createContext, useEffect, useReducer } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";

// reducer function for update the state.
const firebaseReducer = (state, action) =>
{
    switch (action.type) {
        case 'LOGGED_IN_USER':
            return { ...state, user: action.payload };

        default:
            return state;
    }
}

// state
const initialState = {
    user: null
}

// create context
const AuthContext = createContext();

// context provider
const AuthProvider = ({ children }) =>
{

    const [state, dispatch] = useReducer(firebaseReducer, initialState);

    const value = { state, dispatch };

    useEffect(() =>
    {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async(user) =>
        {
            if (user)
            {
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
                // ...
            } else
            {
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: null
                });
            }
        });
        // useEffect cleanup
        return () => unsubscribe();
    }, []);
    return <AuthContext.Provider value={value}>{ children }</AuthContext.Provider>
}

// export
export { AuthContext, AuthProvider };
