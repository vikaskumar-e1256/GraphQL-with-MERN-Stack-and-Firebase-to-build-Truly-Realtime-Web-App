import React, { useContext, useMemo, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import Resizer from "react-image-file-resizer";
import axios from 'axios';
import { GET_USER_INFO } from '../../graphql/queries';
import { USER_UPDATE_PROFILE } from '../../graphql/mutations';
import { AuthContext } from '../../context/authContext';

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

function Profile(props)
{
    const [values, setValues] = useState({
        username: '',
        name: '',
        email: '',
        about: '',
        images: []
    });

    const { state } = useContext(AuthContext);
    const { user } = state;

    const { error, data } = useQuery(GET_USER_INFO);
    const [userUpdate, { data: mdata, loading, error: merror }] = useMutation(USER_UPDATE_PROFILE);

    useMemo(() =>
    {
        if (data && data.profile)
        {
            setValues({
                username: data.profile.username,
                name: data.profile.name,
                email: data.profile.email,
                about: data.profile.about,
                images: data.profile.images
            });
        }
    }, [data]);

    const handleChange = (e) =>
    {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) =>
    {
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
        } catch (error)
        {
            console.error('Cloudinary upload failed', error);
        }
    };

    const handleRemoveImage = async(public_id) =>
    {
        console.log(public_id);
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
            const newImages = values.images.filter((_, imgIndex) => _.public_id !== public_id);
            setValues({ ...values, images: newImages });
        }
    }

    const handleSubmit = (e) =>
    {
        e.preventDefault();
        userUpdate({
            variables: {
                input: {
                    ...values,
                    images: values.images.map((image) => ({
                        url: image.url,
                        public_id: image.public_id, // Ensure you're sending both `url` and `public_id` if required by your backend
                    }))
                },
            },
        });
    };

    if (loading) return 'Submitting...';
    if (merror) return `Submission error! ${merror.message}`;

    const profileUpdateForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    value={values.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                />
            </div>

            <div className="form-group mb-3">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                />
            </div>

            <div className="form-group mb-3">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    disabled
                />
            </div>

            <div className="form-group mb-3">
                <label htmlFor="about">About</label>
                <textarea
                    id="about"
                    name="about"
                    className="form-control"
                    value={values.about}
                    onChange={handleChange}
                    placeholder="Tell something about yourself"
                    rows="4"
                />
            </div>

            <div className="form-group mb-3">
                <label htmlFor="images">Image</label>
                <input
                    type="file"
                    name="images"
                    className="form-control"
                    onChange={handleFileChange}
                    accept="image/*"
                />
            </div>

            <div className="form-group mb-4">
                <label>Profile Images</label>
                <div className="d-flex flex-wrap">
                    {values.images.length > 0 ? (
                        values.images.map((image, index) => (
                            <div key={index} className="position-relative m-2">
                                <img
                                    src={image.url}
                                    alt="profile"
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


            <button type="submit" className="btn btn-primary">Update Profile</button>
        </form>
    );

    return (
        <div className="container pt-5 shadow-sm">
            <h2>Profile</h2>
            {profileUpdateForm()}
        </div>
    );
}

export default Profile;
