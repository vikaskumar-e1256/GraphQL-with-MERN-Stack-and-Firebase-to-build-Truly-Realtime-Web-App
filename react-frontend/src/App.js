import { useContext } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { setContext } from '@apollo/client/link/context';
import Nav from './components/Nav';
import Home from './pages/Home';
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CompleteRegistration from './pages/auth/CompleteRegistration';
import { AuthContext } from "./context/authContext";
import PrivateRoute from './components/PrivateRoute';
import UpdatePassword from './pages/auth/UpdatePassword';
import Profile from './pages/auth/Profile';
import CreatePost from './pages/posts/CreatePost';

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
        <Route
          path="/update/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/update/password"
          element={
            <PrivateRoute>
              <UpdatePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/create/post"
          element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          }
        />
      </Routes>
    </ApolloProvider>
  );
}

export default App;
