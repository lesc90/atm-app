'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type AuthContextType = {
  isAuthed: boolean
  login: (userData: User) => void
  logout: () => void
  user: User | null
  updateUser: (newData: Partial<User>) => void
}

type User = {
  accountId: string
  name: string
  balance: number
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthed(true);
  }

  const logout = () => setIsAuthed(false);

  const updateUser = (newData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...newData } : prev);
  };

  return (
    <AuthContext.Provider value={{ isAuthed, login, logout, user, updateUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}