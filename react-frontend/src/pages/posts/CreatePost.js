import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { AuthContext } from '../../context/authContext';
import { GET_POSTS_BY_USER } from '../../graphql/queries';
import CreatePostForm from './CreatePostForm';
import PostList from './PostList';

function CreatePost()
{
    const { state } = useContext(AuthContext);
    const { user } = state;

    const { data, loading, error, refetch } = useQuery(GET_POSTS_BY_USER);

    return (
        <div className='container p-5'>
            <h4>Create Post</h4>
            <CreatePostForm
                initialValues={{ content: '', images: [] }}
                isEditMode={false}
                onCompleted={refetch}
                userToken={user.token}
            />
            <hr />
            {loading ? (
                <p>Loading posts...</p>
            ) : error ? (
                <p>Error loading posts: {error.message}</p>
            ) : (
                <PostList posts={data.getPostsByUser} refetchPosts={refetch} userToken={user.token} />
            )}
        </div>
    );
}

export default CreatePost;
