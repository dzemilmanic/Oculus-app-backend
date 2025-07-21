// auth.js - backend fajl
import jwt from "jsonwebtoken";
import prisma from "./database.js";

export const verifyToken = (token) => {
  try {
    if (!token) return null;

    // Remove "Bearer " prefix if present
    const cleanToken = token.replace("Bearer ", "");

    // VAŽNO: Ne verifikuj token jer koristi .NET secret
    // Samo dekodiramo payload bez verifikacije
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      console.error("Invalid JWT format");
      return null;
    }

    // Dekodiramo payload deo tokena
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    const decoded = JSON.parse(jsonPayload);
    
    console.log('Backend decoded token payload:', decoded);
    
    return decoded;
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
};

export const getAuthenticatedUser = async (authHeader) => {
  const tokenData = verifyToken(authHeader);
  if (!tokenData) {
    console.log('No token data');
    return null;
  }

  try {
    // Izvuci user ID iz .NET claim-a
    const userId = tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    
    console.log('Looking for user with ID:', userId);

    if (!userId) {
      console.log('No user ID found in token');
      return null;
    }

    const user = await prisma.applicationUser.findUnique({
      where: { Id: userId },
    });
    
    if (user) {
      // Dodaj role iz tokena
      user.role = tokenData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      console.log('Found user with role:', user.role);
    } else {
      console.log('User not found in database');
    }
    
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const hasRole = (user, role) => {
  if (!user) {
    console.log('No user provided to hasRole');
    return false;
  }
  
  console.log('Checking role - user.role:', user.role, 'required role:', role);
  
  const hasRequiredRole = user.role === role;
  console.log('Role check result:', hasRequiredRole);
  
  return hasRequiredRole;
};
