import prisma from '../database.js';
import { getAuthenticatedUser, hasRole } from '../auth.js';
import { v4 as uuidv4 } from 'uuid';

export const reviewResolvers = {
  Query: {
    reviews: async () => {
      const reviews = await prisma.review.findMany({
        include: {
          Author: true
        },
        orderBy: {
          CreatedOn: 'desc'
        }
      });

      return reviews.map(review => ({
        Id: review.Id,
        Rating: review.Rating,
        Content: review.Content,
        CreatedOn: review.CreatedOn.toISOString(),
        UpdatedOn: review.UpdatedOn.toISOString(),
        AuthorName: `${review.Author.FirstName} ${review.Author.LastName}`
      }));
    },

    review: async (_, { id }) => {
      const review = await prisma.review.findUnique({
        where: { Id: id },
        include: {
          Author: true
        }
      });

      if (!review) {
        throw new Error('Recenzija nije pronađena.');
      }

      return {
        Id: review.Id,
        Rating: review.Rating,
        Content: review.Content,
        CreatedOn: review.CreatedOn.toISOString(),
        UpdatedOn: review.UpdatedOn.toISOString(),
        AuthorName: `${review.Author.FirstName} ${review.Author.LastName}`
      };
    },

    userReviewCheck: async (_, __, { authHeader }) => {
      const user = await getAuthenticatedUser(authHeader);
      if (!user) {
        throw new Error('Korisnik nije prijavljen.');
      }

      const hasReview = await prisma.review.count({
        where: { AuthorId: user.Id }
      }) > 0;

      return { hasReview };
    }
  },

  Mutation: {
    createReview: async (_, { input }, { authHeader }) => {
      const user = await getAuthenticatedUser(authHeader);
      if (!user) {
        throw new Error('Korisnik nije prijavljen.');
      }

      // Validacija ocene
      if (input.Rating < 1 || input.Rating > 5) {
        throw new Error('Ocena mora biti između 1 i 5.');
      }

      // Provera da li korisnik već ima recenziju
      const existingReview = await prisma.review.findFirst({
        where: { AuthorId: user.Id }
      });

      if (existingReview) {
        throw new Error('Već ste napisali recenziju.');
      }

      const review = await prisma.review.create({
        data: {
          Id: uuidv4(),
          Rating: input.Rating,
          Content: input.Content,
          AuthorId: user.Id,
          CreatedOn: new Date(),
          UpdatedOn: new Date()
        },
        include: {
          Author: true
        }
      });

      return {
        Id: review.Id,
        Rating: review.Rating,
        Content: review.Content,
        CreatedOn: review.CreatedOn.toISOString(),
        UpdatedOn: review.UpdatedOn.toISOString(),
        AuthorName: `${review.Author.FirstName} ${review.Author.LastName}`
      };
    },

    updateReview: async (_, { id, input }, { authHeader }) => {
      const user = await getAuthenticatedUser(authHeader);
      if (!user) {
        throw new Error('Korisnik nije prijavljen.');
      }

      const review = await prisma.review.findUnique({
        where: { Id: id }
      });

      if (!review) {
        throw new Error('Recenzija nije pronađena.');
      }

      if (review.AuthorId !== user.Id) {
        throw new Error('Nemate dozvolu za ažuriranje ove recenzije.');
      }

      // Validacija ocene
      if (input.Rating < 1 || input.Rating > 5) {
        throw new Error('Ocena mora biti između 1 i 5.');
      }

      const updatedReview = await prisma.review.update({
        where: { Id: id },
        data: {
          Rating: input.Rating,
          Content: input.Content,
          UpdatedOn: new Date()
        },
        include: {
          Author: true
        }
      });

      return updatedReview;
    },

    deleteReview: async (_, { id }, { authHeader }) => {
      const user = await getAuthenticatedUser(authHeader);
      if (!user) {
        throw new Error('Korisnik nije prijavljen.');
      }

      const review = await prisma.review.findUnique({
        where: { Id: id }
      });

      if (!review) {
        throw new Error('Recenzija nije pronađena.');
      }

      const isAdmin = hasRole(user, 'Admin');
      if (review.AuthorId !== user.Id && !isAdmin) {
        throw new Error('Nemate dozvolu za brisanje ove recenzije.');
      }

      await prisma.review.delete({
        where: { Id: id }
      });

      return {
        Success: true,
        Message: 'Recenzija je uspešno obrisana.'
      };
    }
  }
};