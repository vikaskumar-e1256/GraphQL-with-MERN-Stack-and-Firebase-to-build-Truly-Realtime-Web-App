const { authCheck } = require("../../helpers/auth");


const me = async (parent, args, { req, res }) =>
{
    // Check if `req` is available
    if (!req)
    {
        throw new Error('Request object is missing in the context.');
    }
    await authCheck(req);
    return 'Vikas Kumar';
};

module.exports = {
    Query: {
        me
    },

}
