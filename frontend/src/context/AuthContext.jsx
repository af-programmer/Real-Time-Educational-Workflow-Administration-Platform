import { createContext, useContext } from 'react';
import useAuthStore from '../store/authStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useAuthStore();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
