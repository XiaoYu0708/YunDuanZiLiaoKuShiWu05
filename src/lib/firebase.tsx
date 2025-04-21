"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp, FirebaseApp, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCp54vCMkhov2JaLx5uo7t0sH0GMCyVbOI",
  authDomain: "yunduanziliaokushiwu05.firebaseapp.com",
  projectId: "yunduanziliaokushiwu05",
  storageBucket: "yunduanziliaokushiwu05.firebasestorage.app",
  messagingSenderId: "28862711553",
  appId: "1:28862711553:web:ad423957314fcd1a0fbd00"
};

interface FirebaseContextProps {
  app: FirebaseApp;
  auth: Auth;
}

const FirebaseContext = createContext<FirebaseContextProps | null>(null);

export function useFirebase(): FirebaseContextProps {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}

interface AuthContextProps {
  auth: Auth | null;
}

const AuthContext = createContext<AuthContextProps>({ auth: null });

export function useAuth() {
  return useContext(AuthContext);
}

interface FirebaseProviderProps {
  children: ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [appInitialized, setAppInitialized] = useState(false);

  let app: FirebaseApp;
  try {
    app = getApp();
  } catch (e) {
    app = initializeApp(firebaseConfig);
  }

  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authInstance = getAuth(app);
        setAuth(authInstance);
        setAppInitialized(true);
      } catch (error) {
        console.error("Failed to initialize Firebase Auth", error);
      }
    };

    initializeAuth();
  }, [app]);

  if (!appInitialized) {
    return <div>Loading...</div>;
  }

  const firebaseContextValue: FirebaseContextProps = {
    app,
    auth: getAuth(app),
  };

  return (
    <FirebaseContext.Provider value={firebaseContextValue}>
      <AuthContext.Provider value={{ auth }}>
        {children}
      </AuthContext.Provider>
    </FirebaseContext.Provider>
  );
}
// Make sure to add your domain to the authorized domains list in the Firebase console.
    
