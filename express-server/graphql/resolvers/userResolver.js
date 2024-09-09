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

const userUpdate = async (parent, args, { req, res }) =>
{
    const currentUser = await authCheck(req);
    const query = { email: currentUser.email };
    console.log(args);
    return await User.findOneAndUpdate(query, { ...args.input }, { new: true });

}

const profile = async (parent, args, { req, res }) =>
{
    const currentUser = await authCheck(req);
    const query = { email: currentUser.email };
    return await User.findOne(query).exec();

}

const getProfile = async (parent, args, { req, res }) =>
{
    const query = { username: args.username };
    return await User.findOne(query).exec();

}

const allUsers = async (parent, args, { req, res }) =>
{
    return await User.find().exec();
}

module.exports = {
    Query: {
        profile,
        getProfile,
        allUsers
    },
    Mutation: {
        userCreate,
        userUpdate
    }
}
