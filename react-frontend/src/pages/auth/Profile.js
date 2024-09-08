import React, { useMemo, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

// GraphQL query
const GET_USER_INFO = gql`
  query Query {
    profile {
        _id
        username
        email
        name
        images {
            url
            public_id
        }
        about
        createdAt
        updatedAt
    }
  }
`;

// GraphQL mutation
const USER_UPDATE_PROFILE = gql`
  mutation Mutation($input: UserUpdateInput!) {
    userUpdate(input: $input) {
        _id
        username
        email
        name
        images {
            url
            public_id
        }
        about
        createdAt
        updatedAt
    }
  }
`;

function Profile(props)
{
    const [values, setValues] = useState({
        username: '',
        name: '',
        email: '',
        about: '',
        images: []
    });

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

    const handleFileChange = (e) =>
    {
        const files = Array.from(e.target.files);
        const updatedImages = files.map(file => ({
            url: URL.createObjectURL(file),
            file // Store the actual file for upload purposes
        }));
        setValues({ ...values, images: updatedImages });
    };

    const handleSubmit = (e) =>
    {
        e.preventDefault();
        // You need to handle file uploads here if you're uploading images to a server
        userUpdate({
            variables: {
                input: {
                    ...values,
                    images: values.images.map(image => ({
                        url: image.url // Assuming you're using the `url` for the update
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
                    multiple
                />
            </div>

            <div className="form-group mb-4">
                <label>Profile Images</label>
                <div className="d-flex flex-wrap">
                    {values.images.length > 0 ? (
                        values.images.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt="profile"
                                className="img-thumbnail m-2"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
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
