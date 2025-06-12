
import { useState, useEffect, createContext, useContext } from 'react'
import { User, AuthState } from '@/types/auth'

const AuthContext = createContext<{
  authState: AuthState
  login: (phone: string, password: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  verifyPhone: (code: string) => Promise<boolean>
}>({
  authState: { user: null, isAuthenticated: false, isLoading: false },
  login: async () => false,
  register: async () => false,
  logout: () => {},
  verifyPhone: async () => false
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setAuthState({ user, isAuthenticated: true, isLoading: false })
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (phone: string, password: string): Promise<boolean> => {
    // Имитация API запроса
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find((u: any) => u.phone === phone && u.password === password && u.isVerified)
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user
      setAuthState({ user: userWithoutPassword, isAuthenticated: true, isLoading: false })
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const register = async (userData: any): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      isVerified: false
    }
    
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('pendingUser', JSON.stringify(newUser))
    return true
  }

  const verifyPhone = async (code: string): Promise<boolean> => {
    // Имитация проверки SMS кода
    if (code === '1234') {
      const pendingUser = JSON.parse(localStorage.getItem('pendingUser') || '{}')
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      const updatedUsers = users.map((u: any) => 
        u.id === pendingUser.id ? { ...u, isVerified: true } : u
      )
      
      localStorage.setItem('users', JSON.stringify(updatedUsers))
      localStorage.removeItem('pendingUser')
      return true
    }
    return false
  }

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false, isLoading: false })
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, verifyPhone }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
