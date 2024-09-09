const mongoose = require('mongoose');
const User = require('../../models/user');
const Post = require('../../models/post');
const { authCheck } = require('../../helpers/auth');

// Query: fetch all posts
const getAllPosts = async (parent, args, { req }) =>
{
    try
    {
        return await Post.find().populate('postedBy', '_id username').exec();

    } catch (error)
    {
        throw new Error(`Failed to create post: ${error.message}`);
    }
}

const getPostsByUser = async (parent, args, { req }) =>
{
    try
    {
        const currentUser = await authCheck(req);

        if (!currentUser)
        {
            throw new Error('User not authenticated');
        }

        const findUserInDb = await User.findOne({ email: currentUser.email }).exec();

        if (!findUserInDb)
        {
            throw new Error('User not found');
        }

        return await Post.find({
            "postedBy": findUserInDb._id
        }).populate('postedBy', '_id username').exec();

    } catch (error)
    {
        throw new Error(`Failed to create post: ${error.message}`);
    }
}

// Mutation: Create a new post
const postCreate = async (parent, args, { req }) =>
{
    try
    {
        const currentUser = await authCheck(req);

        if (!currentUser)
        {
            throw new Error('User not authenticated');
        }

        const findUserInDb = await User.findOne({ email: currentUser.email }).exec();

        if (!findUserInDb)
        {
            throw new Error('User not found');
        }

        if (args.input.content.trim() === '') throw new Error('Content is required!');

        const newPost = await new Post({
            ...args.input,               // Destructure and spread input fields (content, image)
            postedBy: findUserInDb._id   // Associate the post with the authenticated user
        }).save();

        // Populate the 'postedBy' field with user's id and username
        await newPost.populate('postedBy', '_id username');

        return newPost;

    } catch (error)
    {
        throw new Error(`Failed to create post: ${error.message}`);
    }
}

module.exports = {
    Query: {
        // Add any queries here if needed
        getAllPosts,
        getPostsByUser
    },
    Mutation: {
        // Post creation mutation
        postCreate
    }
}
