const express = require('express');
require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { authCheck, authCheckMiddleware } = require('./helpers/auth');
const Post = require('./models/post');

const { createServer } = require('http');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');

(async function startApolloServer()
{
    try
    {
        // Initialize Express app
        const app = express();

        // Create an HTTP server
        const httpServer = createServer(app);

        // WebSocket server for subscriptions
        const wsServer = new WebSocketServer({
            server: httpServer,
            path: '/subscriptions',
        });

        // Schema setup
        const schema = makeExecutableSchema({ typeDefs, resolvers });

        // WebSocket cleanup setup
        const serverCleanup = useServer({ schema }, wsServer);

        // ApolloServer initialization
        const server = new ApolloServer({
            schema,
            context: async ({ req, res }) => ({ req, res }),
            plugins: [
                ApolloServerPluginDrainHttpServer({ httpServer }),
                {
                    async serverWillStart()
                    {
                        return {
                            async drainServer()
                            {
                                await serverCleanup.dispose();
                            },
                        };
                    },
                },
            ],
        });

        // Start Apollo Server
        await server.start();

        // Middleware
        app.use(cors());
        app.use(bodyParser.json({ limit: '5mb' }));
        app.use('/graphql', expressMiddleware(server));

        // REST Endpoint for testing
        app.get('/rest', authCheck, (req, res) =>
        {
            res.json({ data: 'Hello from Express server!' });
        });

        // Cloudinary configuration
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY,
        });

        // Upload image route
        app.post('/uploadimage', authCheckMiddleware, async (req, res) =>
        {
            try
            {
                const { image } = req.body;
                const result = await cloudinary.uploader.upload(image, {
                    use_filename: true,
                    unique_filename: false,
                    overwrite: true,
                });
                res.json(result);
            } catch (error)
            {
                console.error("Image upload error:", error);
                res.status(500).json({ error: "Image upload failed" });
            }
        });

        // Remove image route
        app.post('/removeimage', authCheckMiddleware, async (req, res) =>
        {
            try
            {
                const { public_id } = req.body;
                const result = await cloudinary.uploader.destroy(public_id, {
                    colors: true,
                });
                res.json(result);
            } catch (error)
            {
                console.error("Image removal error:", error);
                res.status(500).json({ error: "Image removal failed" });
            }
        });

        // Database Connection
        if (!process.env.DATABASE_LOCAL)
        {
            throw new Error("Database connection string is not defined in environment variables.");
        }

        await mongoose.connect(process.env.DATABASE_LOCAL, {
            serverApi: { version: '1', strict: false, deprecationErrors: true },
        });
        console.log("Connected to the database.");

        // Synchronize indexes
        try
        {
            await Post.syncIndexes();
            console.log("Indexes synchronized successfully.");
        } catch (error)
        {
            console.error("Error synchronizing indexes:", error);
        }

        // Start server
        const port = process.env.PORT || 8000;
        httpServer.listen(port, () =>
        {
            console.log(`🚀 Server running at http://localhost:${port}`);
            console.log(`🚀 GraphQL endpoint available at http://localhost:${port}/graphql`);
        });
    } catch (error)
    {
        console.error("Server startup error:", error);
        process.exit(1); // Gracefully exit in case of startup failure
    }
})();
