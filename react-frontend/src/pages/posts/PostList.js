import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { POST_DELETE } from '../../graphql/mutations';
import moment from 'moment';
import CreatePostForm from './CreatePostForm';

function PostList({ posts, refetchPosts, userToken })
{
    const [editingPost, setEditingPost] = useState(null);
    // console.log(editingPost);

    const [postDelete] = useMutation(POST_DELETE, {
        onCompleted: () =>
        {
            refetchPosts();
            setEditingPost(null);
        },
        onError: (error) => toast.error(`Error deleting post: ${error.message}`)
    });

    const handleDelete = async (postId) =>
    {
        if (window.confirm("Are you sure you want to delete this post?"))
        {
            await postDelete({ variables: { postId } });
        }
    };

    return (
        <div className="row">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div className="col-md-4" key={post.id}>
                        {editingPost && editingPost.id === post.id ? (
                            <CreatePostForm
                                initialValues={{
                                    _id: post.id,
                                    content: post.content,
                                    images: post.image ? [{ url: post.image.url, public_id: post.image.public_id }] : []
                                }}
                                isEditMode={true}
                                onCompleted={refetchPosts}
                                userToken={userToken}
                            />
                        ) : (
                            <div className="card mb-4">
                                <img
                                    src={post.image ? post.image.url : 'https://via.placeholder.com/150'}
                                    alt={post.content}
                                    className="card-img-top"
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{post.content.slice(0, 50)}...</h5>
                                    <p className="card-text">Posted by {post.postedBy.username}</p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            {moment(post.createdAt).fromNow()}
                                        </small>
                                    </p>
                                    <button
                                        onClick={() => setEditingPost(post)}
                                        className="btn btn-primary"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="btn btn-danger ml-2"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No posts found</p>
            )}
        </div>
    );
}

export default PostList;
