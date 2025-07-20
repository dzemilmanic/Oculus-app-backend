const { News } = require('../models'); // Pretpostavka da koristiš ORM, npr. Sequelize ili neki DB model

const newsResolvers = {
  Query: {
    allNews: async () => {
      return await News.findAll();
    },

    newsById: async (_, { id }) => {
      return await News.findByPk(id);
    },
  },

  Mutation: {
    addNews: async (_, { input }, context) => {
      // Ovde možeš proveriti autorizaciju iz contexta, npr:
      if (!context.user || !context.user.roles.includes('Admin')) {
        throw new Error('Unauthorized');
      }

      const news = await News.create({
        title: input.title,
        content: input.content,
        publishedDate: input.publishedDate,
      });

      return news;
    },

    updateNews: async (_, { id, input }, context) => {
      if (!context.user || !context.user.roles.includes('Admin')) {
        throw new Error('Unauthorized');
      }

      const news = await News.findByPk(id);
      if (!news) throw new Error('News not found');

      news.title = input.title;
      news.content = input.content;
      news.publishedDate = input.publishedDate;

      await news.save();

      return news;
    },

    deleteNews: async (_, { id }, context) => {
      if (!context.user || !context.user.roles.includes('Admin')) {
        throw new Error('Unauthorized');
      }

      const news = await News.findByPk(id);
      if (!news) throw new Error('News not found');

      await news.destroy();

      return true;
    },
  },
};

module.exports = newsResolvers;
