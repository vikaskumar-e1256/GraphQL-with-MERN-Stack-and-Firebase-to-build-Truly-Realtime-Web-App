import React, { useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';

// GraphQL query to fetch posts
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

    const profileUpdateForm = () => (
        <form>
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
