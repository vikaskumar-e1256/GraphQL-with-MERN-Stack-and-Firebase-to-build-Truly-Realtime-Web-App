const path = require('path');
const { mergeResolvers } = require('@graphql-tools/merge');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { resolvers: scalarResolvers } = require('graphql-scalars');

const resolversArray = loadFilesSync(path.join(__dirname, './resolvers'), { extensions: ['js'] });

// Combine scalar resolvers and the loaded resolvers array
const resolvers = [scalarResolvers, ...resolversArray];

module.exports = mergeResolvers(resolvers);
