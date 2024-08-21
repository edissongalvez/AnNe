import { Text } from '@/components/Text';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

export default function ModalScreen() {
  return (
    <>
      <Text textStyle='XLTitle1' colorStyle='Primary'>Objetivo 1</Text>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </>
  );
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