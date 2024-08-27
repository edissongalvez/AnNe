import { Text } from '@/components/Text'
import { registerUser } from '@/services/authService'
import { useState } from 'react'
import { Button, Pressable, StyleSheet, TextInput, View } from 'react-native'

export default function RegisterScreen() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const validateUsername = () => {
        if (username.trim().length < 3) {
            setMessage('El nombre de usuario debe tener al menos 3 caracteres.')
        }
        return true
    }

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setMessage('Por favor, ingrese un correo electrónico válido.')
            return false
        }
        return true
    }

    const validatePhone = () => {
        const phoneRegex = /^\d{9}$/
        if (!phoneRegex.test(phone)) {
            setMessage('Por favor, ingrese un número de teléfono válido de 9 dígitos.')
            return false
        }
        return true
    }

    const validatePassword = () => {
        if (password.length < 6) {
            setMessage('La contraseña debe tener al menos 6 caracteres.')
            return false
        }
        return true
    };

    const handleRegister = async () => {
        setMessage('')

        if (validateUsername() && validateEmail() && validatePhone() && validatePassword()) {
            try {
                const response = await registerUser({ username, email, phone, password })
                setMessage(response.message)
            } catch (error) {
                setMessage('Error en el registro')
            }
        } else {
            setMessage('Por favor, corrige los errores en el formulario antes de continuar.')
        }
    }

    return (
        <View style={styles.container}>
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
                        <Text textStyle='Body' colorStyle='Primary'>Correo</Text>
                    </View>
                    <TextInput style={styles.textField} keyboardType='email-address' placeholder='Correo' value={email} onChangeText={setEmail} placeholderTextColor='#c5c5c7' />
                </View>
                <View style={styles.separator} />
                <View style={styles.row}>
                    <View style={styles.title}>
                        <Text textStyle='Body' colorStyle='Primary'>Teléfono</Text>
                    </View>
                    <TextInput style={styles.textField} keyboardType='phone-pad' maxLength={9} placeholder='Teléfono' value={phone} onChangeText={setPhone}  placeholderTextColor='#c5c5c7' />
                </View>
                <View style={styles.separator} />
                <View style={styles.row}>
                    <View style={styles.title}>
                        <Text textStyle='Body' colorStyle='Primary'>Contraseña</Text>
                    </View>
                    <TextInput style={styles.textField} placeholder='Contraseña' value={password} onChangeText={setPassword} placeholderTextColor='#c5c5c7' secureTextEntry />
                </View>
            </View>

            {message ? 
                <View style={{ marginTop: 9,  paddingHorizontal: 16, maxWidth: 640, }}>
                    <Text textStyle='Footnote' colorStyle='Secondary'>{message}</Text>
                </View>
            :
                null
            }
         
            <Pressable style={styles.tableRow} onPress={handleRegister}>
                <Text textStyle='Body' colorStyle='Tint'>Registrar</Text>
            </Pressable>
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