import { useQuery } from '@apollo/client';
import queryString from 'query-string';
import { GET_SEARCH_POSTS } from '../graphql/queries';
import { Link } from 'react-router-dom'; // Import Link for navigating to individual post pages

function SearchResult()
{
    const parsed = queryString.parseUrl(window.location.href);
    const searchQuery = parsed.query.s; // Extract the search query from the URL

    const { loading, error, data } = useQuery(GET_SEARCH_POSTS, {
        variables: { query: searchQuery },
    });

    // Handle loading and error states
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error! {error.message}</p>;

    // Destructure posts from the data
    const { search: posts } = data;

    return (
        <div className="container p-5">
            <div className="row">
                {posts.length > 0 ? (
                    posts.map((post) => (
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
                                        <small className="text-muted">{new Date(post.createdAt).toLocaleDateString()}</small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No posts found for your search query.</p>
                )}
            </div>
        </div>
    );
}

export default SearchResult;
