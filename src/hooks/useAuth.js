import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

function useAuth() {
  const [user, setUser] = useState(() => auth.currentUser);
  const [isAuthReady, setIsAuthReady] = useState(() => Boolean(auth.currentUser));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsAuthReady(true);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user),
    isAuthReady,
    isLoading: !isAuthReady,
  };
}

export default useAuth;
