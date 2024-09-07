const path = require('path')
const { loadFilesSync } = require('@graphql-tools/load-files')
const { mergeTypeDefs } = require('@graphql-tools/merge')
const { typeDefs: scalarTypeDefs } = require('graphql-scalars');


const typesArray = loadFilesSync(path.join(__dirname, './types'), { extensions: ['graphql'] })
const typeDefs = [
    ...scalarTypeDefs,
    // other typeDefs
    typesArray
];
module.exports = mergeTypeDefs(typeDefs)
