import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, ReactNode, useEffect, useState } from 'react'

interface User {
    username: string
    email: string
    token: string
}

interface AuthContextType {
    user: User | null
    login: (userData: User) => Promise<void>
    logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('user')
                if (userData) {
                    setUser(JSON.parse(userData))
                }
            } catch (e) {
                console.error('Error loading user data', e)
            }
        }
        loadUserData()
    }, [])

    const login = async (userData: User) => {
        setUser (userData)
        await AsyncStorage.setItem('user', JSON.stringify(userData))
    }

    const logout = async () => {
        setUser(null)
        await AsyncStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}