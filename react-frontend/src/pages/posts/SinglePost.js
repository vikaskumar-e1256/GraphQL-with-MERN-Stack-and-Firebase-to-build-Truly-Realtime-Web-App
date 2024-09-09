import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_SINGLE_POST } from '../../graphql/queries';

function SinglePost()
{
    const { postId } = useParams(); // Get the postId from the URL
    const { loading, error, data } = useQuery(GET_SINGLE_POST, {
        variables: { postId },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error! {error.message}</p>;

    // Destructure the single post data
    const { singlePost: post } = data;

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card mb-4 text-center">
                        <div className="card-body">
                            {/* Display the post image if available, otherwise show a placeholder */}
                            {post.image && post.image.url ? (
                                <img
                                    src={post.image.url}
                                    alt="Post"
                                    className="img-fluid mb-3"
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                />
                            ) : (
                                <img
                                    src="https://via.placeholder.com/150"
                                    alt="No Post Image"
                                    className="img-fluid mb-3"
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                />
                            )}
                            {/* Display the post content */}
                            <h5 className="card-title">{post.content}</h5>
                            {/* Display the postedBy username if available */}
                            {post.postedBy && (
                                <p className="card-text text-muted">Posted by: {post.postedBy.username}</p>
                            )}
                            {/* Display the creation date */}
                            <p className="card-text text-muted">{new Date(post.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SinglePost;
