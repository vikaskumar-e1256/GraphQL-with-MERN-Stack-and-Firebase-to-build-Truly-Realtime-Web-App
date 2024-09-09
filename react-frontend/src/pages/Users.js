import { useQuery } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import { GET_USERS } from '../graphql/queries';
import { useContext } from 'react';

function Users()
{
    const { state } = useContext(AuthContext);
    const { loading, error, data } = useQuery(GET_USERS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error! {error.message}</p>;

    return (
        <div className='container p-5'>
            <div className="row">
                {data.allUsers.map((user) => (
                    <div className="col-md-4" key={user._id}>
                        <div className="card mb-4">
                            <div className="card-body text-center">
                                {user.images && user.images.length > 0 ? (
                                    <img
                                        src={user.images[0].url} // Display the first image from the array
                                        alt={user.username}
                                        className="img-fluid rounded-circle mb-3"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <img
                                        src="https://via.placeholder.com/100" // Placeholder image if no image is available
                                        alt="No Profile"
                                        className="img-fluid rounded-circle mb-3"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                )}
                                <h5 className="card-title">{user.username}</h5>
                                <p className="card-text">{user.about ? user.about : "No description available"}</p>
                                <p className="card-text text-muted">{user.email}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Users;
