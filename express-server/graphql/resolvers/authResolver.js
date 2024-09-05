const { authCheck } = require("../../helpers/auth");


const me = (parent, args, { req, res }) =>
{
    authCheck(req, res);
    return 'Vikas Kumar';
};

module.exports = {
    Query: {
        me
    },

}
