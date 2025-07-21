import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';

import { typeDefs } from './schema.js';
import { resolvers } from './resolvers/index.js';
import prisma from './database.js';

// Load environment variables
dotenv.config();

async function startServer() {
  const port = process.env.PORT || 4000;

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });

  // Start the server
  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(port) },
    context: async ({ req }) => {
      // Extract token from authorization header
      const authHeader = req.headers.authorization;
      
      return {
        authHeader,
        prisma
      };
    },
  });

  console.log(`🚀 GraphQL server running at ${url}`);
  console.log(`📋 GraphQL Playground available at ${url}`);
  console.log(`🏥 Health check available at ${url.replace('/graphql', '')}`);
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer().catch((error) => {
  console.error('❌ Error starting server:', error);
  process.exit(1);
});