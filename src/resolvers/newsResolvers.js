import prisma from '../database.js';
import { getAuthenticatedUser, hasRole } from '../auth.js';

export const newsResolvers = {
  Query: {
    allNews: async () => {
      return await prisma.news.findMany({
        orderBy: {
          PublishedDate: 'desc'
        }
      });
    },

    newsById: async (_, { id }) => {
      const news = await prisma.news.findUnique({
        where: { Id: id }
      });

      if (!news) {
        throw new Error('Vest nije pronađena.');
      }

      return news;
    }
  },

  Mutation: {
    createNews: async (_, { input }, { authHeader }) => {
      const user = await getAuthenticatedUser(authHeader);
      if (!user || !hasRole(user, 'Admin')) {
        throw new Error('Nemate dozvolu za kreiranje vesti.');
      }

      return await prisma.news.create({
        data: {
          Title: input.Title,
          Content: input.Content,
          PublishedDate: new Date(input.PublishedDate)
        }
      });
    },

    updateNews: async (_, { id, input }, { authHeader }) => {
      const user = await getAuthenticatedUser(authHeader);
      if (!user || !hasRole(user, 'Admin')) {
        throw new Error('Nemate dozvolu za ažuriranje vesti.');
      }

      const news = await prisma.news.findUnique({
        where: { Id: id }
      });

      if (!news) {
        throw new Error('Vest nije pronađena.');
      }

      return await prisma.news.update({
        where: { Id: id },
        data: {
          Title: input.Title,
          Content: input.Content,
          PublishedDate: new Date(input.PublishedDate)
        }
      });
    },

    deleteNews: async (_, { id }, { authHeader }) => {
      const user = await getAuthenticatedUser(authHeader);
      if (!user || !hasRole(user, 'Admin')) {
        throw new Error('Nemate dozvolu za brisanje vesti.');
      }

      const news = await prisma.news.findUnique({
        where: { Id: id }
      });

      if (!news) {
        throw new Error('Vest nije pronađena.');
      }

      await prisma.news.delete({
        where: { Id: id }
      });

      return {
        Success: true,
        Message: 'Vest je uspešno obrisana.'
      };
    }
  }
};