const { posts } = require('../../temp');
const { authCheck } = require('../../helpers/auth');

// Query Part
const postsCount = () => posts.length;
const data = async (parent, args, { req, res }) =>
{
    // await authCheck(req);
    return posts;
};

// Mutation Part
const createPost = (parent, args) =>
{
    console.log(parent, '-', args);
    const { title, description } = args.input;
    const post = {
        id: posts.length + 1,
        title: title,
        description: description
    }
    posts.push(post);
    return post;
}

module.exports = {
    Query: {
        total_posts: postsCount,
        all_posts: data
    },
    Mutation: {
        newPost: createPost
    }
}
