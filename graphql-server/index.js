const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
        created_at: new Date().toDateString(),
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
        created_at: new Date().toDateString(),
    },
];

// GraphQL schema
const typeDefs = `
    type Query {
        books_data: [Book]
    }

    type Book {
        title: String
        author: String
        created_at: String
    }
`;

// Resolvers
const resolvers = {
    Query: {
        books_data: () => books,
    },
};

// Create Apollo Server instance
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Start the standalone server
const port = 4000;
startStandaloneServer(server, {
    listen: { port },
}).then(({ url }) =>
{
    console.log(`🚀  Server ready at ${url}`);
});
