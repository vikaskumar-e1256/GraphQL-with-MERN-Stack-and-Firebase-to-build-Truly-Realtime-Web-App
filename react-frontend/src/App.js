import { gql, useQuery } from '@apollo/client';
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
  const [posts, setPosts] = useState([]);

  // Use Apollo Client's useQuery hook to fetch data
  const { loading, error, data } = useQuery(GET_POSTS);

  // UseEffect should not be called conditionally, so handle side effects inside it
  useEffect(() =>
  {
    if (data)
    {
      setPosts(data.all_posts);
    }
  }, [data]); // The effect will run whenever 'data' changes

  // Handling the loading and error states outside of the useEffect hook
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! {error.message}</p>;

  return (
    <div className='container p-5'>
      <div className="row">
        {posts.map((post) => (
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
    </div>
  );
}

export default App;
