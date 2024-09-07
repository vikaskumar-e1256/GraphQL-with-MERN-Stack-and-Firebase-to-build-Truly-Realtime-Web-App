import React, { useMemo, useState } from 'react';
import { gql, useQuery, useLazyQuery } from '@apollo/client';

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
        images: ''
    });

    const [loading, setLoading] = useState(false);

    // Use Apollo Client's useQuery hook to fetch data
    const { error, data } = useQuery(GET_USER_INFO);

    useMemo(() => { }, []);

    return (
        <div className='container pt-5'>
           {JSON.stringify(data)}
        </div>
    );
}

export default Profile;
