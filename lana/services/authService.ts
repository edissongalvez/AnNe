import axios from 'axios'

interface RegisterData {
    username: string
    email: string
    phone: string
    password: string
}

interface LoginData {
    username: string
    password: string
}

interface LoginResponse {
    token: string
    email: string
}

export const registerUser = async (data: RegisterData) => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/register`, data)
        return response.data
    } catch (error: any) {
        console.error('Error en el registro:', error.response ? error.response.data : error.message)
        throw error
    }
}

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/login`, data)
        return response.data
    } catch (error: any) {
        console.error('Error en el inicio de sesión:', error.response ? error.response.data : error.message)
        throw error
    }
}

export const sendEmail = async (subject: string, to: string, message: string) => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/send_email`, { subject, to, message })
        return response.data
    } catch (error: any) {
        console.error('Correo no enviado', error.response ? error.response.data : error.message)
        throw error
    }
}

export const sendWhatsapp = async (to: string, message: string) => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/send_whatsapp`, { to, message })
        return response.data
    } catch (error: any) {
        console.error('Correo no enviado', error.response ? error.response.data : error.message)
        throw error
    }
}