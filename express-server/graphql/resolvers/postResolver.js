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

const postUpdate = async (parent, args, { req }) =>
{
    try
    {
        const currentUser = await authCheck(req);

        if (!currentUser) throw new Error('User not authenticated');

        if (args.input.content.trim() === '') throw new Error('Content is required!');

        // Find user in the database
        const findUserInDb = await User.findOne({ email: currentUser.email }).exec();
        if (!findUserInDb) throw new Error('User not found');

        // Find the post to be updated
        const postToUpdate = await Post.findOne({ _id: args.input._id }).populate('postedBy').exec();
        if (!postToUpdate) throw new Error('Post not found');

        // Check if the logged-in user is the owner of the post
        if (postToUpdate.postedBy._id.toString() !== findUserInDb._id.toString())
        {
            throw new Error('Unauthorized action!');
        }

        // Update the post and return the updated document
        return await Post.findOneAndUpdate(
            { _id: args.input._id },      // Query to find the document by _id
            { $set: { ...args.input } },   // Use $set to update fields
            { new: true }                  // Return the updated document
        );

    } catch (error)
    {
        throw new Error(`Failed to update post: ${error.message}`);
    }
};

const postDelete = async (parent, args, { req }) =>
{
    try
    {
        const currentUser = await authCheck(req);

        if (!currentUser) throw new Error('User not authenticated');

        const findUserInDb = await User.findOne({ email: currentUser.email }).exec();

        if (!findUserInDb) throw new Error('User not found');

        const postToDelete = await Post.findById(args.postId).exec();

        if (postToDelete.postedBy._id.toString() !== findUserInDb._id.toString()) throw new Error('Unauthorized action!');

        return await Post.findOneAndDelete({ _id: args.postId });

    } catch (error)
    {
        throw new Error(`Failed to delete post: ${error.message}`);
    }
}

const singlePost = async (parent, args, { req }) =>
{

    try
    {
        return await Post.findOne({ _id: args.postId }).populate('postedBy', '_id username').exec();

    } catch (error)
    {
        throw new Error(`Failed to fetch single post: ${error.message}`);
    }
}



module.exports = {
    Query: {
        // Add any queries here if needed
        getAllPosts,
        getPostsByUser,
        singlePost
    },
    Mutation: {
        // Post creation mutation
        postCreate,
        postUpdate,
        postDelete
    }
}
