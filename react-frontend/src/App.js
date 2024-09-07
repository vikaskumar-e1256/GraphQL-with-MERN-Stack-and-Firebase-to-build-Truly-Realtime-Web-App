import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Nav from './components/Nav';
import Home from './pages/Home';
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CompleteRegistration from './pages/auth/CompleteRegistration';
import { AuthContext } from "./context/authContext";
import { useContext } from 'react';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
});

function App()
{
  const { state } = useContext(AuthContext);
  const { user } = state;

  const authLink = setContext((_, { headers }) =>
  {
    // Conditionally add authtoken if user is authenticated
    const token = user ? user.token : '';
    return {
      headers: {
        ...headers,
        ...(token && { authtoken: token }) // Add authtoken only if it exists
      }
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Nav />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/complete-registration' element={<CompleteRegistration />} />
      </Routes>
    </ApolloProvider>
  );
}

export default App;
