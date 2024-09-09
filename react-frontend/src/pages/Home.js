import { gql, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { GET_POSTS } from '../graphql/queries';
import moment from 'moment'; // For formatting date
import { Link } from 'react-router-dom';


function Home()
{
    const { state, dispatch } = useContext(AuthContext);
    const { loading, error, data } = useQuery(GET_POSTS);

    // Handle error with toast
    if (error)
    {
        toast.error(`Error: ${error.message}`);
        return <p>Error! {error.message}</p>;
    }

    // Handle loading state
    if (loading) return <p>Loading...</p>;

    return (
        <div className='container p-5'>
            <div className="row">
                {data.getAllPosts.map((post) => (
                    <div className="col-md-4" key={post.id}>
                        <div className="card mb-4">
                            <Link to={`/post/${post.id}`}>
                            <img
                                src={post.image ? post.image.url : 'https://via.placeholder.com/150'}
                                alt={post.content}
                                className="card-img-top"
                                />
                            </Link>
                            <div className="card-body">
                                <h5 className="card-title">{post.content.slice(0, 50)}...</h5>
                                <p className="card-text">Posted by {post.postedBy.username}</p>
                                <p className="card-text">
                                    <small className="text-muted">
                                        {moment(post.createdAt).fromNow()}
                                    </small>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Debugging (Optional) */}
            <hr />
            {JSON.stringify(state.user)}
        </div>
    );
}

export default Home;
