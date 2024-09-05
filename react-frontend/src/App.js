import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Nav from './components/Nav';
import Home from './pages/Home';
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";



const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

function App()
{
  return (
    <ApolloProvider client={client}>
      <Nav />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      {/* <Home /> */}
    </ApolloProvider>
  );
}

export default App;
