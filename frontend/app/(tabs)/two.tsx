import { Button } from '@/components/Button';
import { DropDown } from '@/components/DropDown';
import { InputField } from '@/components/InputField';
import { Text } from '@/components/Text';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native'

const years = [
  '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009',
  '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019',
  '2020', '2021', '2022'
]

const weeks = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
  '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
  '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
  '51', '52'
]

const diagnostics = [
  'A97.0', 'A97.2', 'A97.1'
]

interface FormData {
  ano: string
  semana: string
  densidad_poblacion: string
  temperatura: string
  precipitaciones: string
  humedad: string
  tasa_urbanizacion: string
  presencia_aguas_estancadas: string
}

export default function TabTwoScreen() {
  const [data, setData] = useState<FormData>({
    ano: '2001',
    semana: '1',
    densidad_poblacion: '',
    temperatura: '',
    precipitaciones: '',
    humedad: '',
    tasa_urbanizacion: '',
    presencia_aguas_estancadas: ''
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
      const response = await fetch('http://localhost:5000/predict', { // Cambia la URL por la de tu servidor
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
      <Text textStyle='Headline' colorStyle='Secondary'>OBJETIVO 2</Text>
      <Text textStyle='Title1' colorStyle='Primary'>Previsión de casos de dengue</Text>

      <DropDown items={years} onValueChange={handleInputChange('ano')} placeholder='Año' />
      <DropDown items={weeks} onValueChange={handleInputChange('semana')} placeholder='Semana' />
      {/* <DropDown items={diagnostics} onValueChange={handleInputChange('diagnostic')} placeholder='Diagnóstico' /> */}
      <InputField placeholder='Densidad de población (personas por km²)' onChangeText={handleInputChange('densidad_poblacion')} keyboardType='numeric' min={1} max={250}/>
      <InputField placeholder='Temperatura (°C)' onChangeText={handleInputChange('temperatura')} keyboardType='numeric' min={-2} max={36} />
      <InputField placeholder='Precipitaciones (mm anuales)' onChangeText={handleInputChange('precipitaciones')} keyboardType='numeric' min={50} max={7000}/>
      <InputField placeholder='Humedad (%)' onChangeText={handleInputChange('humedad')} keyboardType='numeric' min={20} max={100}/>
      <InputField placeholder='Tasa de urbanización (%)' onChangeText={handleInputChange('tasa_urbanizacion')} keyboardType='numeric' min={20} max={80}/>
      <DropDown items={['No', 'Si']} onValueChange={handleInputChange('presencia_aguas_estancadas')} placeholder='Presencia de aguas estancadas' />

      {/* <DropDown items={['No', 'Si']} placeholder='Recipientes abiertos' />
      <DropDown items={['No', 'Si']} placeholder='Presencia de ríos' /> */}
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
