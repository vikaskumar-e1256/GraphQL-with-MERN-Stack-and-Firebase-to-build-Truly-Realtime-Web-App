const shortid = require('shortid');
const { authCheck } = require('../../helpers/auth');
const User = require('../../models/user');


// Mutation Part
const userCreate = async (parent, args, { req, res }) =>
{
    const currentUser = await authCheck(req);
    const user = await User.findOne({ email: currentUser.email }).exec();
    return user ? user : await new User({
        username: shortid.generate(),
        email: currentUser.email
    }).save();

}

module.exports = {
    Query: {

    },
    Mutation: {
        userCreate
    }
}
