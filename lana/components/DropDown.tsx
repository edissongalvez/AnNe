import { Picker } from "@react-native-picker/picker"
import { useState } from "react"
import { StyleSheet } from "react-native"

import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'

const colorScheme = useColorScheme()

interface DropDownProps {
    items: string[]
    placeholder?: string
    onValueChange?: (value: string | number) => void
    selectedValue?: string | number
}

export function DropDown({ items, placeholder, onValueChange, selectedValue }: DropDownProps) {
    const [selectedItem, setSelectedItem] = useState<string | number>(selectedValue || '')

    const handleValueChange = (value: string | number) => {
        setSelectedItem(value)
        if (onValueChange) {
            onValueChange(value)
        }
    }

    const color = Colors[colorScheme ?? 'light'].tint
    const backgroundColor = Colors[colorScheme ?? 'light'].fillSecondary

    return <Picker style={[{color, backgroundColor} , styles.container]} selectedValue={selectedItem} onValueChange={handleValueChange}>
        {placeholder && <Picker.Item label={placeholder} enabled={false} />}
        {items.map(item => <Picker.Item key={item} label={item} value={item} />)}
    </Picker>
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 100,
        flexDirection: 'row',
        gap: 5,
        height: 44,
        paddingHorizontal: 18,
        alignItems: 'center',
        borderWidth: 0,
        fontSize: 17,
        fontFamily: 'SFPro'
    }
})