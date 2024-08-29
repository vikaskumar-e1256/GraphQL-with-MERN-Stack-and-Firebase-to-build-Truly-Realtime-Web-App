const { posts } = require('../../temp');

// Query Part
const postsCount = () => posts.length;
const data = () => posts;

// Mutation Part
const createPost = (parent, args) =>
{
    console.log(parent, '-', args);
    const post = {
        id: posts.length + 1,
        title: args.title,
        description: args.description
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
