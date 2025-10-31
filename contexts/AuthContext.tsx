import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

// Declare the 'google' object from the Google Identity Services script
declare const google: any;

interface AuthContextType {
  user: User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The Google Client ID should be set as an environment variable.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

/**
 * Decodes the JWT token from Google Sign-In to extract user profile information.
 */
function decodeJwtResponse(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding JWT", error);
        return null;
    }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const handleCredentialResponse = (response: any) => {
    console.log("Encoded JWT ID token: " + response.credential);
    const decoded: any = decodeJwtResponse(response.credential);
    if (decoded) {
        const newUser: User = {
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture,
        };
        setUser(newUser);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof google !== 'undefined') {
        google.accounts.id.disableAutoSelect();
    }
  };

  useEffect(() => {
    if (typeof google !== 'undefined') {
        if (GOOGLE_CLIENT_ID) {
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
                use_fedcm_for_prompt: false
            });

            // This prompt allows returning users to sign in with one tap
            google.accounts.id.prompt();
        } else {
            console.warn("Google Client ID is not configured. Google Sign-In will not function.");
        }
    }
  }, []);

  const value = { user, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
