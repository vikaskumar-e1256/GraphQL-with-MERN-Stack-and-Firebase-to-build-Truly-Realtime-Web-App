import { gql, useQuery, useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

// GraphQL query to fetch posts
const GET_POSTS = gql`
  query Query {
    all_posts {
      id
      title
      description
    }
  }
`;

function App()
{
  // Use Apollo Client's useQuery hook to fetch data
  const { loading, error, data } = useQuery(GET_POSTS);

  // Use Apollo Client's useLazyQuery hook to fetch data
  const [fire, { data: all_posts }] = useLazyQuery(GET_POSTS);

  // Handling the loading and error states outside of the useEffect hook
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! {error.message}</p>;

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
    </div>
  );
}

export default App;
