const { posts } = require('../../temp');

const postsCount = () => posts.length;
const data = () => posts;

module.exports = {
    Query: {
        total_posts: postsCount,
        all_posts: data
    },
}
