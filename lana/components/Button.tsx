import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable, StyleSheet } from 'react-native'
import { Text } from './Text'
import { useState } from 'react'

import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'

const colorScheme = useColorScheme()

interface ButtonProps {
    action?: () => void
}

export function Button({ action }: ButtonProps) {
    const [hover, setHover] = useState(false)
    const handleHoverIn = () => setHover(true)
    const handleHoverOut = () => setHover(false)

    const tintColor = Colors[colorScheme ?? 'light'].tint
    const fillTintColor = Colors[colorScheme ?? 'light'].fillTint

    return <Pressable style={({ pressed }) => [{backgroundColor: pressed ? tintColor :  hover ?  fillTintColor : 'transparent'}, styles.container]} onHoverIn={handleHoverIn} onHoverOut={handleHoverOut} onPress={action}>
        {({ pressed }) => 
            <>
                <MaterialCommunityIcons name="magic-staff" size={32} color={pressed ? 'white' : tintColor} />
                <Text textStyle='Label' colorStyle={pressed ? 'White' : 'Tint'}>Predecir</Text>
            </>
        }
    </Pressable>
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 500,
        flexDirection: 'row',
        gap: 6,
        height: 52,
        paddingHorizontal: 25,
        alignItems: 'center'
    }
})