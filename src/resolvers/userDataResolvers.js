import prisma from './database.js';
import { getAuthenticatedUser } from './auth.js';

export const userDataResolvers = {
  Mutation: {
    updateUserData: async (_, { input }, context) => {
      try {
        // Proveri da li je korisnik autentikovan - koristi authHeader iz context-a
        const authHeader = context.authHeader;
        
        if (!authHeader) {
          return {
            Success: false,
            Message: "Authorization header nije pronađen",
            User: null
          };
        }
        
        const user = await getAuthenticatedUser(authHeader);
        
        if (!user) {
          return {
            Success: false,
            Message: "Korisnik nije pronađen",
            User: null
          };
        }

        const updateData = {};

        // Validacija i ažuriranje imena
        if (input.FirstName !== undefined && input.FirstName !== null) {
          const firstName = input.FirstName.trim();
          if (firstName.length === 0) {
            return {
              Success: false,
              Message: "Ime ne može biti prazno",
              User: null
            };
          }
          if (firstName.length < 2) {
            return {
              Success: false,
              Message: "Ime mora biti duže od 2 karaktera.",
              User: null
            };
          }
          updateData.FirstName = firstName;
        }

        // Validacija i ažuriranje prezimena
        if (input.LastName !== undefined && input.LastName !== null) {
          const lastName = input.LastName.trim();
          if (lastName.length === 0) {
            return {
              Success: false,
              Message: "Prezime ne može biti prazno",
              User: null
            };
          }
          if (lastName.length < 2) {
            return {
              Success: false,
              Message: "Prezime mora biti duže od 2 karaktera.",
              User: null
            };
          }
          updateData.LastName = lastName;
        }

        // Validacija i ažuriranje biografije
        if (input.Biography !== undefined && input.Biography !== null) {
          const biography = input.Biography.trim();
          if (biography.length > 0 && biography.length < 2) {
            return {
              Success: false,
              Message: "Biografija mora biti duža od 2 karaktera.",
              User: null
            };
          }
          updateData.Biography = biography.length > 0 ? biography : null;
        }

        // Proveri da li ima bilo koje promene
        if (Object.keys(updateData).length === 0) {
          return {
            Success: false,
            Message: "Nijedna validna promena nije prosleđena",
            User: null
          };
        }

        // Ažuriraj podatke u bazi
        const updatedUser = await prisma.applicationUser.update({
          where: { Id: user.Id },
          data: updateData,
        });

        return {
          Success: true,
          Message: "Podaci korisnika su uspešno ažurirani",
          User: updatedUser
        };

      } catch (error) {
        console.error("Error updating user data:", error);
        return {
          Success: false,
          Message: "Greška pri ažuriranju podataka korisnika",
          User: null
        };
      }
    }
  }
};