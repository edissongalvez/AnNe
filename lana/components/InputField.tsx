import { useState } from "react"
import { InputModeOptions, StyleSheet, TextInput } from "react-native"

import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'

const colorScheme = useColorScheme()

interface InputFieldProps {
    placeholder?: string
    keyboardType?: InputModeOptions | undefined
    onChangeText?: (text: string) => void
    min?: number
    max?: number
}

export function InputField({ placeholder = '', keyboardType = 'text', onChangeText, min = 0, max = 128}: InputFieldProps) {
    const [value, setValue] = useState('')

    const placeholderTextColor = Colors[colorScheme ?? 'light'].textSecondary
    const containerColor = Colors[colorScheme ?? 'light'].fillSecondary
    
    const handleChangeText = (text: string) => {
        if (keyboardType = 'numeric') {
            const numericText = text.replace(/[^0-9]/g, '')
            const number = parseInt(numericText, 10)
            if (numericText === '' || (number >= min && number <= max)) {
                setValue(numericText);
            } else {
                setValue('0')
            }
        } else {
            setValue(text)
        }
        
        if (onChangeText) {
            onChangeText(text)
        }
    }

    return <TextInput style={[{backgroundColor: containerColor}, styles.container]} placeholder={placeholder} placeholderTextColor={placeholderTextColor} inputMode={keyboardType} value={value} onChangeText={handleChangeText} />
}

const styles = StyleSheet.create({
    container: {
        height: 44,
        paddingHorizontal: 20,
        borderRadius: 12,
        fontSize: 17,
        fontFamily: 'SFPro'
    }
})