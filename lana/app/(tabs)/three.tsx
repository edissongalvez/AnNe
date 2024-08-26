import { Button } from '@/components/Button'
import { DropDown } from '@/components/DropDown'
import { Text } from '@/components/Text'
import { AuthContext } from '@/contexts/AuthContext'
import axios from 'axios'
import { router } from 'expo-router'
import { useContext, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native'

interface FormData {
  fiebre: boolean
  cefalea: boolean
  dolrretroo: boolean
  malgias: boolean
  artralgia: boolean
  erupcionr: boolean
  dolor_abdo: boolean
  vomito: boolean
  diarrea: boolean
  caida_plaq: boolean
}

export default function TabThreeScreen() {
  const authContext = useContext(AuthContext)
  const [formData, setFormData] = useState<FormData>({
    fiebre: false,
    cefalea: false,
    dolrretroo: false,
    malgias: false,
    artralgia: false,
    erupcionr: false,
    dolor_abdo: false,
    vomito: false,
    diarrea: false,
    caida_plaq: false
  })
  const [result, setResult] = useState<string>()

  if (!authContext) {
    return null
  }

  const { user } = authContext

  const handleToggleSwitch = (field: keyof FormData) => {
    setFormData({ ...formData, [field]: !formData[field] })
  }

  const handleSubmit = () => {

    const data = {
      fiebre: formData.fiebre ? 1 : 0,
      cefalea: formData.cefalea ? 1 : 0,
      dolrretroo: formData.dolrretroo ? 1 : 0,
      malgias: formData.malgias ? 1 : 0,
      artralgia: formData.artralgia ? 1 : 0,
      erupcionr: formData.erupcionr ? 1 : 0,
      dolor_abdo: formData.dolor_abdo ? 1 : 0,
      vomito: formData.vomito ? 1 : 0,
      diarrea: formData.diarrea ? 1 : 0,
      caida_plaq: formData.caida_plaq ? 1 : 0
    }

    axios.post(`${process.env.EXPO_PUBLIC_API_URL}/predict2`, data)
      .then(response =>
        setResult(`Probabilidad de dengue: ${response.data.result} (${response.data.probability_dengue})`)
      )
      .catch(error => {
        alert(error.message || 'Ocurrió un error')
      })
  }

  return (
    <ScrollView style={styles.container}>
          <Text textStyle='Headline' colorStyle='Secondary'>OBJETIVO 3</Text>
          <Text textStyle='Title1' colorStyle='Primary'>Diagnóstico de dengue</Text>
          <View style={styles.groupedList}>
            {Object.keys(formData).map(key => (
              <View key={key}>
                <View style={styles.switchContainer}>
                  <Text textStyle='Body' colorStyle='Primary'>{key}</Text>
                  <Switch
                    value={formData[key as keyof FormData]}
                    onValueChange={() => handleToggleSwitch(key as keyof FormData)}
                  />
                </View>
                <View style={styles.separator} />
              </View>
            ))}
          </View>

          <Pressable style={styles.tableRow} onPress={handleSubmit}>
            <Text textStyle='Body' colorStyle='Tint'>Predecir</Text>
          </Pressable>

          {result && 
            <>
              <View style={{ marginTop: 37, paddingHorizontal: 16 }}>
                <Text textStyle='Footnote' colorStyle='Secondary'>RESULTADO</Text>
              </View>
              <View style={styles.result}>
                <Text textStyle='Body' colorStyle='Tint'>{result}</Text>
              </View>
              <View style={{ marginTop: 9, paddingHorizontal: 16 }}>
                <Text textStyle='Footnote' colorStyle='Secondary'>Mimi</Text>
              </View>
            </>
          }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f7'
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 44,
    alignItems: 'center',
    paddingHorizontal: 16
  },
  groupedList: {
    maxWidth: 640,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 10
  },
  row: {
    height: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  tableRow: {
    height: 44,
    maxWidth: 640,
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
  },
  result: {
    maxWidth: 640,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 149, 0, .15)',
    marginTop: 10,
    padding: 16
  }
})