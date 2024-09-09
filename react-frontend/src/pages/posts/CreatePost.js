import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import axios from 'axios';
import Resizer from 'react-image-file-resizer'; // Ensure you have installed this package
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/authContext';
import { POST_CREATE } from '../../graphql/mutations';

const resizeFile = (file) =>
    new Promise((resolve) =>
    {
        Resizer.imageFileResizer(
            file,
            300,
            300,
            "JPEG",
            100,
            0,
            (uri) =>
            {
                resolve(uri);
            },
            "base64"
        );
    });

function CreatePost()
{
    const { state } = useContext(AuthContext); // Get current user from context
    const { user } = state;
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum fermentum blandit. Fusce eleifend efficitur mauris, sit amet vulputate risus vestibulum et. Aliquam rhoncus nisi eu tincidunt laoreet. Phasellus non justo tortor. Maecenas nibh risus, feugiat sed magna sit amet, varius suscipit eros. Proin pharetra gravida enim consectetur dignissim. Morbi vel efficitur nibh. Donec vel vehicula dui. Nullam vel pharetra dui, vitae egestas libero. Integer tempor metus eu felis congue ornare. Fusce porta fringilla nunc, vitae efficitur est consequat at. Nulla fermentum eget nunc eu pulvinar. Suspendisse consequat, nunc id feugiat tristique, sem tellus commodo mi, vitae pellentesque arcu leo a turpis. Aliquam erat volutpat. Cras sodales ornare eros, et laoreet magna bibendum sed. Duis in mattis neque. Sed commodo, tellus id bibendum malesuada, nunc lectus eleifend augue, vel facilisis odio turpis ut justo. Duis blandit dui ut velit venenatis, ac pretium felis sollicitudin. Nulla ut lobortis ligula. Fusce luctus purus eget auctor tempor. Nunc mi metus, imperdiet sed fringilla varius, scelerisque quis sapien. Sed ut lorem eu enim suscipit ornare id quis ex. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis lobortis, massa sed dapibus laoreet, dui mi pellentesque eros, eu vestibulum nisi neque imperdiet erat. Pellentesque pellentesque dapibus elit quis aliquam. Morbi dapibus, lectus vitae dictum condimentum, purus lorem fermentum dolor, ac convallis augue felis sed sapien.',
        images: []
    });
    const [postCreate] = useMutation(POST_CREATE, {
        onCompleted: () =>
        {
            toast.success('Post created successfully!');
            setValues({ content: '', images: [] }); // Reset form
            setLoading(false);
        },
        onError: (error) =>
        {
            toast.error(`Error creating post: ${error.message}`);
            setLoading(false);
        },
    });

    const handleChange = (e) =>
    {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);
        try
        {
            await postCreate({
                variables: {
                    input: {
                        content: values.content,
                        image: values.images[0] || null, // Use the first image if available
                    },
                },
            });
        } catch (error)
        {
            setLoading(false);
        }
    };

    const handleImageChange = async (e) =>
    {
        setLoading(true);
        try
        {
            const file = e.target.files[0];
            const image = await resizeFile(file);

            const response = await axios.post(
                `${process.env.REACT_APP_REST_ENDPOINT}/uploadimage`,
                { image },
                {
                    headers: {
                        authtoken: user.token,
                    },
                }
            );

            setValues({
                ...values,
                images: [...values.images, { url: response.data.url, public_id: response.data.public_id }]
            });
            setLoading(false);
        } catch (error)
        {
            setLoading(false);
            console.error('Cloudinary upload failed', error);
            toast.error('Image upload failed. Please try again.');
        }
    };

    const handleRemoveImage = async (public_id) =>
    {
        setLoading(true);
        try
        {
            const response = await axios.post(
                `${process.env.REACT_APP_REST_ENDPOINT}/removeimage`,
                { public_id },
                {
                    headers: {
                        authtoken: user.token,
                    },
                }
            );
            if (response.status === 200)
            {
                const newImages = values.images.filter((image) => image.public_id !== public_id);
                setValues({ ...values, images: newImages });
                toast.success('Image removed successfully');
            }
            setLoading(false);
        } catch (error)
        {
            setLoading(false);
            console.error('Failed to remove image', error);
            toast.error('Image removal failed. Please try again.');
        }
    };

    return (
        <div className='container p-5'>
            <h4>Create Post</h4>
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

                <div className='form-group mt-3'>
                    <input
                        type='file'
                        accept='image/*'
                        className='form-control'
                        onChange={handleImageChange}
                    />
                </div>

                <div className="form-group mb-4">
                    <label>Images</label>
                    <div className="d-flex flex-wrap">
                        {values.images.length > 0 ? (
                            values.images.map((image, index) => (
                                <div key={index} className="position-relative m-2">
                                    <img
                                        src={image.url}
                                        alt="image"
                                        className="img-thumbnail"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                        onClick={() => handleRemoveImage(image.public_id)}
                                        style={{ transform: 'translate(50%, -50%)' }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No images available</p>
                        )}
                    </div>
                </div>

                <button
                    className='btn btn-primary mt-3'
                    type='submit'
                    disabled={loading || !values.content}
                >
                    {loading ? '...' : 'Create Post'}
                </button>
            </form>
        </div>
    );
}

export default CreatePost;
