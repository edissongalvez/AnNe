import { Button } from '@/components/Button'
import { DropDown } from '@/components/DropDown'
import { Text } from '@/components/Text'
import { useState } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'

interface FormData {
  eyepain: string
  fever: string
  nausea: string
  headache: string
  vomiting: string
  jointpain: string
  loss_appet: string
  musclepain: string
  diarrhea: string
  darkurine: string
  jaundice: string
  abdominal: string
  bleeding: string
}

export default function TabTwoScreen() {
  const [data, setData] = useState<FormData>({
    eyepain: 'No',
    fever: 'No',
    nausea: 'No',
    headache: 'No',
    vomiting: 'No',
    jointpain: 'No',
    loss_appet: 'No',
    musclepain: 'No',
    diarrhea: 'No',
    darkurine: 'No',
    jaundice: 'No',
    abdominal: 'No',
    bleeding: 'No'
  })

  const [prediction, setPrediction] = useState<string | null>(null)

  const handleInputChange = (key: string) => (text: string | number) => {
    setData(prevData => ({ ...prevData, [key]: text }))
  }
  const handleSubmit = async () => {
    const emptyFields = Object.keys(data).filter((key) => !data[key as keyof typeof data])

    if (emptyFields.length > 0) {
      Alert.alert(
        'Campos Vacíos',
        `Por favor complete los siguientes campos: ${emptyFields.join(', ')}`,
        [{ text: 'OK' }]
      )
      alert(`Por favor complete los siguientes campos: ${emptyFields.join(', ')}`)
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/predict1`, { // Cambia la URL por la de tu servidor
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      setPrediction(`La predicción es: ${result.prediction}`) // Actualiza el estado con el resultado
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al obtener la predicción.')
      alert('Ocurrió un error al obtener la predicción.')
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text textStyle='Headline' colorStyle='Secondary'>OBJETIVO 3</Text>
      <Text textStyle='Title1' colorStyle='Primary'>Diagnóstico predectivo de dengue</Text>

      <DropDown items={['No', 'Si']} onValueChange={handleInputChange('eyepain')} placeholder='Dolor ocular' />
      <DropDown items={['No', 'Si']} onValueChange={handleInputChange('fever')} placeholder='Fiebre' />
      <DropDown items={['No', 'Si']} onValueChange={handleInputChange('nausea')} placeholder='Náuseas' />
      <DropDown items={['No', 'Si']} onValueChange={handleInputChange('headache')} placeholder='Dolor de cabeza' />
      <DropDown items={['No', 'Si']} onValueChange={handleInputChange('vomiting')} placeholder='Vómitos' />
      <DropDown items={['No', 'Si']} onValueChange={handleInputChange('jointpain')} placeholder='Dolor en las articulaciones' />
      <DropDown items={['No', 'Si']} onValueChange={handleInputChange('loss_appet')} placeholder='Pérdida de apetito' />
      <DropDown items={['No', 'Si']} onValueChange={handleInputChange('musclepain')} placeholder='Dolor muscular' />
      <DropDown items={['No', 'Si']} onValueChange={handleInputChange('diarrhea')} placeholder='Diarrear' />
      <DropDown items={['No', 'Si']} onValueChange={handleInputChange('darkurine')} placeholder='Darkuina' />
      <DropDown items={['No', 'Si']} onValueChange={handleInputChange('jaundice')} placeholder='Ictericia' />
      <DropDown items={['No', 'Si']} onValueChange={handleInputChange('abdominal')} placeholder='Abdominal' />
      <DropDown items={['No', 'Si']} onValueChange={handleInputChange('bleeding')} placeholder='Sangrado' />

      <Button action={handleSubmit} />

      {prediction && <Text textStyle='Body' colorStyle='Tint'>{prediction}</Text>}

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 16,
    gap: 8
  }
})