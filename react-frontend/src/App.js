import { useContext } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
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
import ForgotPassword from './pages/auth/ForgotPassword';
import PublicRoute from './components/PublicRoute';
import Users from './pages/Users';
import SingleUser from './pages/SingleUser';
import SearchResult from './pages/SearchResult';
import SinglePost from './pages/posts/SinglePost';


const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.REACT_APP_GRAPHQL_SUBSCRIPTION_ENDPOINT,
  }),
);



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

  // The split function takes three parameters:
  //
  // * A function that's called for each operation to execute
  // * The Link to use for an operation if the function returns a "truthy" value
  // * The Link to use for an operation if the function returns a "falsy" value
  const splitLink = split(
    ({ query }) =>
    {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink,
  );

  const client = new ApolloClient({
    link: authLink.concat(splitLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Nav />
      <ToastContainer />
      <Routes>

        {/* Global Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/user/:username' element={<SingleUser />} />
        <Route path='/post/:postId' element={<SinglePost />} />
        <Route path='/users' element={<Users />} />
        <Route path='/complete-registration' element={<CompleteRegistration />} />
        <Route path='/search' element={<SearchResult />} />

        {/* Public Routes */}
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Private Routes */}
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
