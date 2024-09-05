let authorize = true;

exports.authCheck = (req, res, next = (f) => f) =>
{
    if (!req.headers.authtoken) {
        throw new Error('Unauthorized!');
    }

    const valid = req.headers.authtoken === 'secret';

    if (!valid) {
        throw new Error('Unauthorized!');
    } else
    {
        next();
    }
}
