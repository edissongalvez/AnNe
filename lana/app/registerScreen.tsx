import { Text } from '@/components/Text'
import { registerUser } from '@/services/authService'
import { useState } from 'react'
import { Button, TextInput } from 'react-native'

export default function RegisterScreen() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const handleRegister = async () => {
        try {
            const response = await registerUser({ username, email, phone, password })
            setMessage(response.message)
        } catch (error) {
            setMessage('Error en el registro')
        }
    }

    return (
        <>
            <TextInput placeholder='Usuario' value={username} onChangeText={setUsername} />
            <TextInput placeholder='Email' value={email} onChangeText={setEmail} />
            <TextInput placeholder='Teléfono' value={phone} onChangeText={setPhone} />
            <TextInput placeholder='Contraseña' value={password} onChangeText={setPassword} secureTextEntry />
            <Button title='Registrar' onPress={handleRegister} />
            {message ? <Text textStyle={'Footnote'} colorStyle={'Secondary'}>{message}</Text> : null}
        </>
    )
}