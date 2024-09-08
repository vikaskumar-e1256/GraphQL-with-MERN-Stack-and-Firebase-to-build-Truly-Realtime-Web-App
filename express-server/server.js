const express = require('express');
require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { authCheck, authCheckMiddleware } = require('./helpers/auth');

// Database Connection
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
main().catch(err => console.log(err));

async function main()
{
    await mongoose.connect(process.env.DATABASE_LOCAL, clientOptions);
}

// Create an instance of ApolloServer
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) =>
    {
        // Ensure req and res are passed correctly
        return { req, res };
    }
});

// Start the Apollo Server and integrate with Express
async function startApolloServer()
{
    // Initialize Express app
    const app = express();

    // Apply middlewares like CORS and body-parser
    app.use(cors());
    app.use(bodyParser.json({limit: "5mb"}));

    // Start Apollo Server
    await server.start();

    // Apply Apollo GraphQL middleware and set the path to /graphql
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req, res }) =>
        {
            return { req, res };
        }
    }));

    // Define other Express routes if needed
    app.get('/rest', authCheck, (req, res) =>
    {
        res.json({ data: 'Hello from Express server!' });
    });

    // cloudinary Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    });

    // Upload the image
    app.post('/uploadimages', authCheckMiddleware, async(req, res) =>
    {
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        };

        try
        {
            const imagePath = req.body.image;
            const result = await cloudinary.uploader.upload(imagePath, options);
            console.log(result);
            return result.public_id;
        } catch (error)
        {
            console.error(error);
        }
    });

    // Remove the image
    app.post('/removeimage', authCheckMiddleware, async(req, res) =>
    {
        // Return colors in the response
        const options = {
            colors: true,
        };

        try
        {
            // Get details about the asset
            const publicId = req.body.public_id;
            const result = await cloudinary.api.destroy(publicId, options);
            console.log(result);
            return result.colors;
        } catch (error)
        {
            console.error(error);
        }
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
