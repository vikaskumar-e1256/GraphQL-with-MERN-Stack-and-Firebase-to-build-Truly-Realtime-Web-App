const admin = require("firebase-admin");

const serviceAccount = require("../config/graphql-node-react-firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


exports.authCheck = async (req) =>
{
    try
    {
        const currentUser = await admin.auth().verifyIdToken(req.headers.authtoken);
        // console.log(currentUser);
        return currentUser;
    } catch (error)
    {
        console.log('Auth check error::', error);
        throw new Error('Invalid or expired token');
    }
}

exports.authCheckMiddleware = async (req, res, next) =>
{
    if (req.headers.authtoken) {
        admin.auth().verifyIdToken(req.headers.authtoken)
            .then((result) =>
            {
                next();
            }).catch((error) => console.log(error));
    } else
    {
        res.json({ error: 'unauthorized' });
    }
}
