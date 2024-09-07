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
  const { state, dispatch } = useContext(AuthContext);
  const { user } = state;

  const authLink = setContext((_, { headers }) =>
  {
    // get the authentication token from local storage if it exists
    // const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authtoken: user ? user.token : ''
        // authorization: token ? `Bearer ${token}` : "",
      }
    }
  });
  
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
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
      {/* <Home /> */}
    </ApolloProvider>
  );
}

export default App;
