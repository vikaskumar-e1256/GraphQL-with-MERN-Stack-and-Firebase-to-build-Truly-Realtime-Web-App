const express = require('express');
require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const bodyParser = require('body-parser');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');


// Create an instance of ApolloServer
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Start the Apollo Server and integrate with Express
async function startApolloServer()
{
    // Initialize Express app
    const app = express();

    // Apply middlewares like CORS and body-parser
    app.use(cors());
    app.use(bodyParser.json());

    // Start Apollo Server
    await server.start();

    // Apply Apollo GraphQL middleware and set the path to /graphql
    app.use('/graphql', expressMiddleware(server));

    // Define other Express routes if needed
    app.get('/rest', (req, res) =>
    {
        res.json({data: 'Hello from Express server!'});
    });

    // Start the Express server on port 8000
    const port = process.env.PORT || 8000;
    app.listen(port, () =>
    {
        console.log(`🚀 Express server running at http://localhost:${port}`);
        console.log(`🚀 GraphQL endpoint available at http://localhost:${port}/graphql`);
    });
}

startApolloServer();
