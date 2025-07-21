import jwt from 'jsonwebtoken';
import prisma from './database.js';

export const verifyToken = (token) => {
  try {
    if (!token) return null;
    
    // Remove "Bearer " prefix if present
    const cleanToken = token.replace('Bearer ', '');
    
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const getAuthenticatedUser = async (authHeader) => {
  const tokenData = verifyToken(authHeader);
  if (!tokenData) return null;

  try {
    const user = await prisma.applicationUser.findUnique({
      where: { Id: tokenData.nameid || tokenData.sub || tokenData.userId }
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const hasRole = (user, role) => {
  
    return user && (user.roles?.includes(role) || user.role === role);
};