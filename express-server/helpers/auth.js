let authorize = true;

exports.authCheck = (req, res, next = (f) => f) =>
{
    if (authorize) {
        next();
    } else
    {
        throw new Error('Unauthorized!');
    }
}
