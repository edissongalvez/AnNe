import { Text } from '@/components/Text'
import { Picker } from '@react-native-picker/picker'
import axios from 'axios'
import { useState } from 'react'
import { Button, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'

export default function TabOneScreen() {
  const [month, setMonth] = useState<string>('')
  const [age, setAge] = useState<string>('')
  const [sex, setSex] = useState<string>('')
  const [temperature, setTemperature] = useState<string>('')
  const [disease, setDisease] = useState<string>('')
  const [result, setResult] = useState<string>('')

  const handleSubmit = async () => {
    if (!month || !age || !sex || !temperature || !disease) {
      alert('Datos incompletos')
      return
    }

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/predict`, [
        {
          mes: parseInt(month, 10),
          edad: parseInt(age, 10),
          sexo: parseInt(sex, 10),
          temperatura: parseInt(temperature, 10),
          enfermedad: parseInt(disease, 10),
        }
      ])

      setResult(`Regiones: ${response.data.region}\nProvincias: ${response.data.province}\nDistritos: ${response.data.district}`)
    } catch (error: any) {
      alert('Error al predecir')
    }
  }

  return (   
    <ScrollView style={styles.container}>
      <Text textStyle='Headline' colorStyle='Secondary'>OBJETIVO 1</Text>
      <Text textStyle='Title1' colorStyle='Primary'>Zonas de dengue</Text>
      <View style={{ marginTop: 37, paddingHorizontal: 16 }}>
        <Text textStyle='Footnote' colorStyle='Secondary'>FORMULARIO</Text>
      </View>
      <View style={styles.groupedList}>
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Mes:</Text> 
          </View>
          <Picker style={styles.textField} selectedValue={month} onValueChange={(itemValue, itemIndex) => setMonth(itemValue)}>
            <Picker.Item label='Enero' value='1' />
            <Picker.Item label='Febrero' value='2' />
            <Picker.Item label='Marzo' value='3' />
            <Picker.Item label='Abril' value='4' />
            <Picker.Item label='Mayo' value='5' />
            <Picker.Item label='Junio' value='6' />
            <Picker.Item label='Julio' value='7' />
            <Picker.Item label='Agosto' value='8' />
            <Picker.Item label='Septiembre' value='9' />
            <Picker.Item label='Octubre' value='10' />
            <Picker.Item label='Noviembre' value='11' />
            <Picker.Item label='Diciembre' value='12' />
          </Picker>
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Edad:</Text> 
          </View>
          <TextInput style={styles.textField} value={age} onChangeText={setAge} keyboardType='numeric' placeholder='Ingresar edad' placeholderTextColor='#c5c5c7' />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Sexo:</Text> 
          </View>
          <Picker style={styles.textField} selectedValue={sex} onValueChange={(itemValue, itemIndex) => setSex(itemValue)}>
            <Picker.Item label='Mujer' value='1' />
            <Picker.Item label='Hombre' value='2' />
          </Picker>
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Temperatura:</Text> 
          </View>
          <TextInput style={styles.textField} value={temperature} onChangeText={setTemperature} keyboardType='numeric' placeholder='Ingresar temperatura' placeholderTextColor='#c5c5c7' />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Dengue:</Text> 
          </View>
          <Picker style={styles.textField} selectedValue={disease} onValueChange={(itemValue, itemIndex) => setDisease(itemValue)}>
            <Picker.Item label='Sí' value='1' />
            <Picker.Item label='No' value='0' />
          </Picker>
        </View>
      </View>
      <View style={{ marginTop: 9,  paddingHorizontal: 16 }}>
        <Text textStyle='Footnote' colorStyle='Secondary'>Predice las zonas con dengue</Text>
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
    padding: 16,
    backgroundColor: '#f2f2f7'
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
