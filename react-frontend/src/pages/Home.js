import { useQuery, useSubscription } from '@apollo/client';
import { toast } from 'react-toastify';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { GET_POSTS, TOTAL_POST_COUNT } from '../graphql/queries';
import moment from 'moment'; // For formatting date
import { Link } from 'react-router-dom';
import { POST_ADDED, POST_UPDATED, POST_DELETED } from '../graphql/subscriptions';

function Home()
{
    const [page, setPage] = useState(1);  // State to track the current page
    const postsPerPage = 6;  // Define the number of posts per page (match your backend's perPage value)
    const { state } = useContext(AuthContext);

    // Fetch posts for the current page
    const { loading, error, data } = useQuery(GET_POSTS, {
        variables: {
            page
        }
    });

    // Fetch total post count for pagination
    const { data: postCountData } = useQuery(TOTAL_POST_COUNT);

    // Subscription to handle new posts (POST_ADDED)
    useSubscription(POST_ADDED, {
        onSubscriptionData: ({ client, subscriptionData }) =>
        {
            const newPost = subscriptionData.data.postAdded;

            // Read from cache
            const existingPosts = client.readQuery({
                query: GET_POSTS,
                variables: { page: 1 }, // First page or current page
            });

            // Write new post into the cache at the beginning
            client.writeQuery({
                query: GET_POSTS,
                variables: { page: 1 },
                data: {
                    getAllPosts: [newPost, ...existingPosts.getAllPosts], // Prepend new post
                },
            });

            // Update total post count in the cache
            if (postCountData)
            {
                client.writeQuery({
                    query: TOTAL_POST_COUNT,
                    data: {
                        postCount: postCountData.postCount + 1, // Increment the post count
                    },
                });
            }
        },
    });

    // Subscription to handle post updates (POST_UPDATED)
    useSubscription(POST_UPDATED, {
        onSubscriptionData: ({ client, subscriptionData }) =>
        {
            const updatedPost = subscriptionData.data.postUpdated;

            // Read the cache
            const existingPosts = client.readQuery({
                query: GET_POSTS,
                variables: { page: 1 }, // Or any other page
            });

            // Find and update the post in the cache
            const updatedPosts = existingPosts.getAllPosts.map((post) =>
                post.id === updatedPost.id ? updatedPost : post
            );

            // Write updated post list back to the cache
            client.writeQuery({
                query: GET_POSTS,
                variables: { page: 1 },
                data: {
                    getAllPosts: updatedPosts,
                },
            });
        },
    });

    // Subscription to handle post deletions (POST_DELETED)
    useSubscription(POST_DELETED, {
        onSubscriptionData: ({ client, subscriptionData }) =>
        {
            const deletedPostId = subscriptionData.data.postDeleted.id;

            // Read the cache
            const existingPosts = client.readQuery({
                query: GET_POSTS,
                variables: { page: 1 }, // Or the current page
            });

            // Filter out the deleted post
            const remainingPosts = existingPosts.getAllPosts.filter(
                (post) => post.id !== deletedPostId
            );

            // Write updated post list back to the cache
            client.writeQuery({
                query: GET_POSTS,
                variables: { page: 1 },
                data: {
                    getAllPosts: remainingPosts,
                },
            });

            // Update total post count in the cache
            if (postCountData)
            {
                client.writeQuery({
                    query: TOTAL_POST_COUNT,
                    data: {
                        postCount: postCountData.postCount - 1, // Decrement the post count
                    },
                });
            }
        },
    });

    // Calculate the total number of pages
    const totalPosts = postCountData ? postCountData.postCount : 0;
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    // Handle error with toast
    if (error)
    {
        toast.error(`Error: ${error.message}`);
        return <p>Error! {error.message}</p>;
    }

    // Handle loading state
    if (loading) return <p>Loading...</p>;

    // Handle pagination click
    const handlePageChange = (newPage) =>
    {
        if (newPage > 0 && newPage <= totalPages)
        {
            setPage(newPage);
        }
    };

    // Generate an array of page numbers with ellipses
    const renderPaginationNumbers = () =>
    {
        const pageNumbers = [];
        const maxPageNumbersToShow = 5;  // Maximum number of page numbers to show at a time
        let startPage, endPage;

        if (totalPages <= maxPageNumbersToShow)
        {
            startPage = 1;
            endPage = totalPages;
        } else
        {
            if (page <= Math.ceil(maxPageNumbersToShow / 2))
            {
                startPage = 1;
                endPage = maxPageNumbersToShow;
            } else if (page + Math.floor(maxPageNumbersToShow / 2) >= totalPages)
            {
                startPage = totalPages - maxPageNumbersToShow + 1;
                endPage = totalPages;
            } else
            {
                startPage = page - Math.floor(maxPageNumbersToShow / 2);
                endPage = page + Math.floor(maxPageNumbersToShow / 2);
            }
        }

        if (startPage > 1)
        {
            pageNumbers.push(
                <button key="prev-ellipsis" className="btn btn-outline-primary mx-1" disabled>
                    ...
                </button>
            );
        }

        for (let i = startPage; i <= endPage; i++)
        {
            pageNumbers.push(
                <button
                    key={i}
                    className={`btn mx-1 ${i === page ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages)
        {
            pageNumbers.push(
                <button key="next-ellipsis" className="btn btn-outline-primary mx-1" disabled>
                    ...
                </button>
            );
        }

        return pageNumbers;
    };

    return (
        <div className="container p-5">
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
                                    <small className="text-muted">{moment(post.createdAt).fromNow()}</small>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center mt-4">
                <span className="mx-3">Page {page} of {totalPages}</span>
                <button
                    className="btn btn-outline-primary me-2"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                >
                    Previous
                </button>
                {renderPaginationNumbers()}
                <button
                    className="btn btn-outline-primary"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                >
                    Next
                </button>
            </div>

            {/* Debugging (Optional) */}
            <hr />
            {JSON.stringify(state.user)}
        </div>
    );
}

export default Home;
