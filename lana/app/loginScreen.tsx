import { Text } from '@/components/Text'
import { AuthContext } from '@/contexts/AuthContext'
import { StatusBar } from 'expo-status-bar'
import { useContext, useState } from 'react'
import { Button, Platform, StyleSheet, TextInput, View } from 'react-native'
import { router } from 'expo-router'
import { loginUser } from '@/services/authService'

export default function LoginScreen() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const authContext = useContext(AuthContext)

  if (!authContext) {
    return null
  }

  const { user, login, logout } = authContext

  const handleLogin = async () => {
    try {
      const response = await loginUser({ username, password })
      if (response.token) {
        const userData = { username, email: response.email, token: response.token }
        await login(userData)
        setMessage('Inicio de sesión exitoso')
        router.replace('/')
      }
    } catch (error) {
      setMessage('Credenciales incorrectas')
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/loginScreen')
  }

  return (
    <View style={styles.container}>
      {user ? 
        <>
          <Text textStyle='Title1' colorStyle='Primary'>{user?.username}</Text>
          <Button title='Cerrar sesión' onPress={handleLogout} />
        </>
      :
        <>
          <TextInput placeholder='Usuario' value={username} onChangeText={setUsername} />
          <TextInput placeholder='Contraseña' value={password} onChangeText={setPassword} secureTextEntry />
          <Button title='Iniciar sesión' onPress={handleLogin} />
          <Button title='Registrar usuario' onPress={() => router.push('/registerScreen')} />
          {message ? <Text textStyle={'Footnote'} colorStyle={'Secondary'}>{message}</Text> : null}
        </>
      }
      

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
