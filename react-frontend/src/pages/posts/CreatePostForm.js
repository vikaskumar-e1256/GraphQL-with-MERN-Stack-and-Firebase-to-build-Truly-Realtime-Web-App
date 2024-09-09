import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import { POST_CREATE, POST_UPDATE } from '../../graphql/mutations';
import ImageUploader from './ImageUploader'; // For handling image uploads

const resizeImage = (file) =>
    new Promise((resolve) =>
        Resizer.imageFileResizer(
            file,
            300,
            300,
            'JPEG',
            100,
            0,
            (uri) => resolve(uri),
            'base64'
        )
    );

function CreatePostForm({ initialValues, isEditMode, onCompleted, userToken })
{
    const [values, setValues] = useState(initialValues || { content: '', images: [] });
    console.log(values);
    const [loading, setLoading] = useState(false);

    const [postCreate] = useMutation(POST_CREATE, {
        onCompleted,
        onError: (error) => toast.error(`Error creating post: ${error.message}`)
    });

    const [postUpdate] = useMutation(POST_UPDATE, {
        onCompleted,
        onError: (error) => toast.error(`Error updating post: ${error.message}`)
    });

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);

        try
        {
            const mutation = isEditMode ? postUpdate : postCreate;

            // Prepare the variables object
            const variables = {
                input: {
                    content: values.content,
                    image: values.images[0] || null,
                },
            };

            // Add _id to variables if it's an update
            if (isEditMode)
            {
                variables.input._id = values._id; // Ensure `_id` is part of `values` when editing
            }

            await mutation({
                variables,
            });

            setLoading(false);
        } catch (error)
        {
            setLoading(false);
            console.error(error);
        }
    };


    const handleChange = (e) =>
    {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (file) =>
    {
        setLoading(true);
        try
        {
            const image = await resizeImage(file);
            const response = await axios.post(
                `${process.env.REACT_APP_REST_ENDPOINT}/uploadimage`,
                { image },
                { headers: { authtoken: userToken } }
            );
            setValues((prev) => ({
                ...prev,
                images: [...prev.images, { url: response.data.url, public_id: response.data.public_id }]
            }));
            setLoading(false);
        } catch (error)
        {
            setLoading(false);
            toast.error('Image upload failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='form-group'>
                <textarea
                    name="content"
                    value={values.content}
                    onChange={handleChange}
                    className='form-control'
                    placeholder='Write your post content here...'
                    rows='5'
                    required
                ></textarea>
            </div>

            <ImageUploader
                images={values.images}
                onImageUpload={handleImageUpload}
                onImageRemove={(public_id) => setValues({
                    ...values,
                    images: values.images.filter((image) => image.public_id !== public_id)
                })}
                loading={loading}
            />

            <button className='btn btn-primary mt-3' type='submit' disabled={loading || !values.content}>
                {loading ? '...' : isEditMode ? 'Update Post' : 'Create Post'}
            </button>
        </form>
    );
}

export default CreatePostForm;
