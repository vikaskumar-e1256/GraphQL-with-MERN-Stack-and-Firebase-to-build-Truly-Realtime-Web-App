import { gql, useQuery, useLazyQuery } from '@apollo/client';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { GET_POSTS } from '../graphql/queries';


function Home()
{
    const { state, dispatch } = useContext(AuthContext);
    // Use Apollo Client's useQuery hook to fetch data
    const { loading, error, data } = useQuery(GET_POSTS);

    // Use Apollo Client's useLazyQuery hook to fetch data
    const [fire, { data: all_posts }] = useLazyQuery(GET_POSTS);

    // Handling the loading and error states outside of the useEffect hook
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error! {error.message}</p>;

    const changeUserName = () =>
    {
        dispatch({
            type: 'LOGGED_IN_USER',
            payload: 'Vikas Kumar'
        });
    }

    return (
        <div className='container p-5'>
            <div className="row">
                {data.all_posts.map((post) => (
                    <div className="col-md-4" key={post.id}>
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">{post.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='p-5'>
                <button onClick={() => fire()}>Fetch</button>
            </div>
            {JSON.stringify(all_posts)}
            <hr />
            {JSON.stringify(state.user)}
            <div className='p-5'>
                <button onClick={changeUserName}>Change user name</button>
            </div>
        </div>
    );
}

export default Home;
