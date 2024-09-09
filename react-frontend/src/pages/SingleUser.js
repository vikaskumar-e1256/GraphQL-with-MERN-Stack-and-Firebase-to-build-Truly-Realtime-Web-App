import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_USER_BY_USERNAME } from '../graphql/queries';

function UserDetails()
{
    const { username } = useParams(); // Get the user username from the URL
    const { loading, error, data } = useQuery(GET_USER_BY_USERNAME, {
        variables: { username },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error! {error.message}</p>;

    const { getProfile: user } = data;

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card mb-4 text-center">
                        <div className="card-body">
                            {user.images && user.images.length > 0 ? (
                                <img
                                    src={user.images[0].url}
                                    alt={user.username}
                                    className="img-fluid rounded-circle mb-3"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                />
                            ) : (
                                <img
                                    src="https://via.placeholder.com/150"
                                    alt="No Profile"
                                    className="img-fluid rounded-circle mb-3"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                />
                            )}
                            <h5 className="card-title">{user.username}</h5>
                            <p className="card-text">{user.about ? user.about : "No description available"}</p>
                            <p className="card-text text-muted">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDetails;
