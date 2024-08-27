import { Text } from '@/components/Text'
import { AuthContext } from '@/contexts/AuthContext'
import { StatusBar } from 'expo-status-bar'
import { useContext, useState } from 'react'
import { Button, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native'
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
        const userData = { username, email: response.email, phone: response.phone, token: response.token }
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
          <Text textStyle='Title1' colorStyle='Primary'>{user.username}</Text>
          <Text textStyle='Body' colorStyle='Primary'>{user.email}</Text>
          <Text textStyle='Body' colorStyle='Primary'>{user.phone}</Text>
          <Pressable style={styles.tableRow} onPress={handleLogout}>
            <Text textStyle='Body' colorStyle='Tint'>Cerrar sesión</Text>
          </Pressable>
        </>
      :
        <>
          <View style={styles.groupedList}>
            <View style={styles.row}>
              <View style={styles.title}>
                <Text textStyle='Body' colorStyle='Primary'>Usuario</Text>
              </View>
              <TextInput style={styles.textField} placeholder='Usuario' value={username} onChangeText={setUsername} placeholderTextColor='#c5c5c7' />
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <View style={styles.title}>
                <Text textStyle='Body' colorStyle='Primary'>Contraseña</Text>
              </View>
              <TextInput style={styles.textField} placeholder='Ingrese contraseña' value={password} onChangeText={setPassword} placeholderTextColor='#c5c5c7' secureTextEntry />
            </View>
          </View>
          {message ? 
            <View style={{ marginTop: 9,  paddingHorizontal: 16, maxWidth: 640, }}>
              <Text textStyle='Footnote' colorStyle='Secondary'>{message}</Text>
            </View>
          :
            null
          }
         
          <Pressable style={styles.tableRow} onPress={handleLogin}>
            <Text textStyle='Body' colorStyle='Tint'>Iniciar sesión</Text>
          </Pressable>

          <Pressable style={styles.tableRow} onPress={() => router.push('/registerScreen')}>
            <Text textStyle='Body' colorStyle='Tint'>Registrar usuario</Text>
          </Pressable>
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
    backgroundColor: '#f2f2f7',
    padding: 16
  },
  groupedList: {
    width: 320,
    borderRadius: 10,
    backgroundColor: '#fff'
  },
  row: {
    height: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tableRow: {
    height: 44,
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 37
  },
  separator: {
    height: 1,
    backgroundColor: '#b9b9bb',
    marginHorizontal: 16
  },
  title: {
    width: 100
  },
  textField: {
    flex: 1,
    fontSize: 17,
    borderWidth: 0,
    paddingHorizontal: 16,
    height: '100%'
  }
})
