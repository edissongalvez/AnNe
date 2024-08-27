import { Text } from '@/components/Text'
import { AuthContext } from '@/contexts/AuthContext'
import { sendEmail, sendWhatsapp } from '@/services/authService'
import { Picker } from '@react-native-picker/picker'
import axios from 'axios'
import { useContext, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'

export default function TabOneScreen() {
  const [month, setMonth] = useState<string>('1')
  const [age, setAge] = useState<string>('')
  const [sex, setSex] = useState<string>('1')
  const [temperature, setTemperature] = useState<string>('')
  const [disease, setDisease] = useState<string>('0')
  
  const [result, setResult] = useState<string>('')

  const authContext = useContext(AuthContext)

  if (!authContext) {
    return null
  }

  const { user } = authContext

  const handleSubmit = async () => {
    if (!month || !age || !sex || !temperature || !disease) {
      alert('Datos incompletos')
      console.log(month)
      console.log(age)
      console.log(sex)
      console.log(temperature)
      console.log(disease)
      return
    }

    if (isNaN(parseInt(age, 10)) || isNaN(parseInt(temperature, 10)) || parseInt(age, 10) < 0 || parseInt(age, 10) > 70 || parseInt(temperature, 10) < 20 || parseInt(temperature, 10) > 35) {
      alert('Datos incorrectos')
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

  const handleSendWhatsapp = async () => {
    if (!user) {
      alert('Inicie sesión')
      return
    }

    if (!result) {
      alert('Sin nada que enviar')
      return
    }

    try {
      const response = await sendWhatsapp( user.phone, `RESULTADO DE ZONA DE DENGUE:\n\n${result}`, user.token)
      alert(response.message)
    } catch (error: any) {
      alert('Error al enviar')
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
            <Text textStyle='Body' colorStyle='Primary'>Mes</Text> 
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
            <Text textStyle='Body' colorStyle='Primary'>Edad</Text> 
          </View>
          <TextInput style={styles.textField} value={age} onChangeText={setAge} keyboardType='numeric' placeholder='Ingresar 1-70' placeholderTextColor='#c5c5c7' />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Sexo</Text> 
          </View>
          <Picker style={styles.textField} selectedValue={sex} onValueChange={(itemValue, itemIndex) => setSex(itemValue)}>
            <Picker.Item label='Mujer' value='1' />
            <Picker.Item label='Hombre' value='2' />
          </Picker>
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Temperatura</Text> 
          </View>
          <TextInput style={styles.textField} value={temperature} onChangeText={setTemperature} keyboardType='numeric' placeholder='Ingresar 20°-35°' placeholderTextColor='#c5c5c7' />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Dengue</Text> 
          </View>
          <Picker style={styles.textField} selectedValue={disease} onValueChange={(itemValue, itemIndex) => setDisease(itemValue)}>
            <Picker.Item label='Sí' value='1' />
            <Picker.Item label='No' value='0' />
          </Picker>
        </View>
      </View>
      <View style={{ marginTop: 9,  paddingHorizontal: 16, maxWidth: 640, }}>
        <Text textStyle='Footnote' colorStyle='Secondary'>Modelo predictivo para identificar áreas de alto riesgo de dengue, utilizando datos como mes, edad, sexo, temperatura, y casos confirmados de dengue.</Text>
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
          <Pressable style={styles.tableRow} onPress={handleSendWhatsapp}>
            <Text textStyle='Body' colorStyle='Tint'>Enviar a WhatsApp</Text>
          </Pressable>
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
    width: 200
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
