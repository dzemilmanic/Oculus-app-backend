import jwt from "jsonwebtoken";
import prisma from "./database.js";

// U backend auth.js fajlu:
export const verifyToken = (token) => {
  try {
    if (!token) return null;
    const cleanToken = token.replace("Bearer ", "");
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    
    // Dodaj role iz tokena u decoded objekat
    decoded.role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
                   decoded.role || 
                   decoded.roles?.[0];
                   
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export const hasRole = (tokenData, role) => {
  if (!tokenData) return false;
  
  // Provjeri role direktno iz JWT tokena
  const userRole = tokenData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
                   tokenData.role || 
                   tokenData.roles?.[0];
                   
  return userRole === role;
};

export const getAuthenticatedUser = async (authHeader) => {
  const tokenData = verifyToken(authHeader);
  if (!tokenData) return null;

  try {
    const user = await prisma.applicationUser.findUnique({
      where: { Id: tokenData.nameid || tokenData.sub || tokenData.userId },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    console.error("Error fetching user:", error);
    return null;
  }
};

